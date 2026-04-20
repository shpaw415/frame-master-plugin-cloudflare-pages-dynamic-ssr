import { dirname, extname, join, relative, resolve } from "path";
import { mkdirSync, rmSync } from "fs";
import type { FrameMasterPlugin } from "frame-master/plugin/types";
import * as ts from "typescript";
import { name, version } from "./package.json";

const USE_DYNAMIC_REGEX =
	/^(?:\s*(?:\/\/.*?\n|\s)*)?['"]use[-\s]dynamic['"];?\s*(?:\/\/.*)?(?:\r?\n|$)/m;

export type ParseOutputModuleConfig = {
	module: string;
	exportName?: string;
};

export type HydrationConfig = {
	mountSelector?: string;
	payloadElementId?: string;
	serverAdapterModule?: string;
	serverAdapterExportName?: string;
	clientAdapterModule?: string;
	clientAdapterExportName?: string;
};

export type CloudflarePagesDynamicSSROptions = {
	basePath?: string;
	generatedDir?: string;
	publicClientPath?: string;
	parseOutput?: ParseOutputModuleConfig;
	hydration?: HydrationConfig;
	verbose?: boolean;
};

type DynamicRoutePlan = {
	filePath: string;
	routePath: string;
	functionEntrypoint: string;
	clientEntrypoint: string;
	clientPublicPath: string;
	routeKey: string;
};

type GenerationState = {
	plans: DynamicRoutePlan[];
	entrypoints: string[];
	generatedDir: string;
};

const DEFAULT_GENERATED_DIR =
	".frame-master/generated/cloudflare-pages-dynamic-ssr";
const DEFAULT_PUBLIC_CLIENT_PATH = "/_dynamic";
const DEFAULT_MOUNT_SELECTOR = "#app";
const DEFAULT_PAYLOAD_ELEMENT_ID = "__FM_DYNAMIC_PAYLOAD__";

function toPosixPath(value: string): string {
	return value.replaceAll("\\", "/");
}

function ensureImportSpecifier(fromFile: string, toFile: string): string {
	const rel = toPosixPath(relative(dirname(fromFile), toFile));
	if (rel.startsWith(".")) {
		return rel;
	}
	return `./${rel}`;
}

function isBareModuleSpecifier(value: string): boolean {
	if (value.startsWith(".")) {
		return false;
	}
	if (value.startsWith("/")) {
		return false;
	}
	return !value.includes(":");
}

function makeProjectImportSpecifier(
	fromFile: string,
	requested: string,
): string {
	if (isBareModuleSpecifier(requested)) {
		return requested;
	}
	const absTarget = requested.startsWith("/")
		? requested
		: resolve(process.cwd(), requested);
	return ensureImportSpecifier(fromFile, absTarget);
}

function makeRoutePath(baseDir: string, filePath: string): string {
	const relativePath = toPosixPath(relative(baseDir, filePath));
	const extension = extname(relativePath);
	const withoutExt = relativePath.slice(0, -extension.length);
	const normalized = withoutExt.endsWith("/index")
		? withoutExt.slice(0, -"/index".length)
		: withoutExt === "index"
			? ""
			: withoutExt;
	return normalized === "" ? "/" : `/${normalized}`;
}

function routeToEntryFile(routePath: string): string {
	if (routePath === "/") {
		return "index.ts";
	}
	return `${routePath.slice(1)}.ts`;
}

function routeToKey(routePath: string): string {
	return routePath === "/" ? "root" : routePath.slice(1).replaceAll("/", "__");
}

function hasUseDynamicDirective(source: string): boolean {
	return USE_DYNAMIC_REGEX.test(source);
}

function functionLikeFromIdentifier(
	identifierName: string,
	sourceFile: ts.SourceFile,
): boolean {
	for (const statement of sourceFile.statements) {
		if (
			ts.isFunctionDeclaration(statement) &&
			statement.name?.text === identifierName
		) {
			return true;
		}
		if (ts.isVariableStatement(statement)) {
			for (const decl of statement.declarationList.declarations) {
				if (!ts.isIdentifier(decl.name)) {
					continue;
				}
				if (decl.name.text !== identifierName) {
					continue;
				}
				const init = decl.initializer;
				if (!init) {
					continue;
				}
				if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
					return true;
				}
			}
		}
	}
	return false;
}

function hasDefaultExportedFunction(source: string, filePath: string): boolean {
	const sourceFile = ts.createSourceFile(
		filePath,
		source,
		ts.ScriptTarget.Latest,
		true,
		filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
	);

	for (const statement of sourceFile.statements) {
		if (ts.isFunctionDeclaration(statement)) {
			const hasDefault = Boolean(
				statement.modifiers?.some(
					(m) => m.kind === ts.SyntaxKind.DefaultKeyword,
				),
			);
			const hasExport = Boolean(
				statement.modifiers?.some(
					(m) => m.kind === ts.SyntaxKind.ExportKeyword,
				),
			);
			if (hasDefault && hasExport) {
				return true;
			}
		}

		if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
			const expr = statement.expression;
			if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
				return true;
			}
			if (ts.isIdentifier(expr)) {
				if (functionLikeFromIdentifier(expr.text, sourceFile)) {
					return true;
				}
			}
		}
	}

	return false;
}

async function discoverDynamicPages(baseDir: string): Promise<string[]> {
	const matches = new Set<string>();
	for await (const relPath of new Bun.Glob("**/*.tsx").scan({ cwd: baseDir })) {
		matches.add(resolve(baseDir, relPath));
	}
	for await (const relPath of new Bun.Glob("**/*.jsx").scan({ cwd: baseDir })) {
		matches.add(resolve(baseDir, relPath));
	}

	const dynamicFiles: string[] = [];
	for (const absPath of matches) {
		const source = await Bun.file(absPath).text();
		if (!hasUseDynamicDirective(source)) {
			continue;
		}
		if (!hasDefaultExportedFunction(source, absPath)) {
			throw new Error(
				`[cloudflare-pages-dynamic-ssr] File ${absPath} uses use-dynamic but does not default export a function component.`,
			);
		}
		dynamicFiles.push(absPath);
	}

	dynamicFiles.sort();
	return dynamicFiles;
}

async function writeFileWithParents(
	path: string,
	content: string,
): Promise<void> {
	mkdirSync(dirname(path), { recursive: true });
	await Bun.write(path, content);
}

async function writeRuntimeFiles(generatedDir: string): Promise<void> {
	const runtimeDir = join(generatedDir, "runtime");
	await writeFileWithParents(
		join(runtimeDir, "default-server-adapter.ts"),
		`export type ServerHydrationAdapterArgs = {
  pageHtml: string;
  payloadJson: string;
  payloadElementId: string;
  mountSelector: string;
  clientScriptPath: string;
};

export default function defaultServerAdapter(args: ServerHydrationAdapterArgs): string {
  return [
		\`<div id="\${args.mountSelector.slice(1)}">\${args.pageHtml}</div>\`,
		\`<script id="\${args.payloadElementId}" type="application/json">\${args.payloadJson}</script>\`,
		\`<script type="module" src="\${args.clientScriptPath}"></script>\`,
	].join("");
}
`,
	);

	await writeFileWithParents(
		join(runtimeDir, "default-client-adapter.ts"),
		`import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";

export type ClientHydrationAdapterArgs = {
  Component: unknown;
  payload: Record<string, unknown>;
  mountElement: Element;
};

export default function defaultClientAdapter(args: ClientHydrationAdapterArgs): void {
  const component = args.Component as (props: Record<string, unknown>) => unknown;
  const props = (args.payload.props ?? {}) as Record<string, unknown>;
  hydrateRoot(args.mountElement, createElement(component, props));
}
`,
	);

	await writeFileWithParents(
		join(runtimeDir, "server.ts"),
		`import { createElement } from "react";
import { renderToString } from "react-dom/server";

type ParseOutputContext = {
  routePath: string;
  pathname: string;
  params: Record<string, unknown>;
};

type RenderArgs = {
  context: {
    request: Request;
    params?: Record<string, unknown>;
  };
  routePath: string;
  clientScriptPath: string;
  mountSelector: string;
  payloadElementId: string;
  Page: unknown;
  parseOutput?: (html: string, ctx: ParseOutputContext) => string | Promise<string>;
  hydrationServerAdapter: (args: {
    pageHtml: string;
    payloadJson: string;
    payloadElementId: string;
    mountSelector: string;
    clientScriptPath: string;
  }) => string;
};

function escapeJsonForHtml(json: string): string {
  return json.replace(/</g, "\\\\u003c").replace(/>/g, "\\\\u003e").replace(/&/g, "\\\\u0026");
}

export async function renderDynamicPage(args: RenderArgs): Promise<Response> {
  const params = args.context.params ?? {};
  const pathname = new URL(args.context.request.url).pathname;
  const page = args.Page as (props: Record<string, unknown>) => unknown;

  const pageHtml = renderToString(createElement(page, { params, pathname }));
  const payloadJson = escapeJsonForHtml(JSON.stringify({ props: { params, pathname } }));

  const body = args.hydrationServerAdapter({
    pageHtml,
    payloadJson,
    payloadElementId: args.payloadElementId,
    mountSelector: args.mountSelector,
    clientScriptPath: args.clientScriptPath,
  });

	const htmlDoc = '<!doctype html><html><head><meta charset="utf-8" /></head><body>' + body + '</body></html>';
  const transformed = args.parseOutput
    ? await args.parseOutput(htmlDoc, {
        routePath: args.routePath,
        pathname,
        params,
      })
    : htmlDoc;

  return new Response(transformed, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
`,
	);
}

function parseOutputImport(
	parseOutput: ParseOutputModuleConfig,
	routeFilePath: string,
): string {
	const importPath = makeProjectImportSpecifier(
		routeFilePath,
		parseOutput.module,
	);
	const exportName = parseOutput.exportName ?? "default";
	if (exportName === "default") {
		return `import parseOutput from "${importPath}";`;
	}
	return `import { ${exportName} as parseOutput } from "${importPath}";`;
}

function makeServerAdapterImport(
	options: ResolvedOptions,
	routeFilePath: string,
	runtimeServerAdapterPath: string,
): string {
	if (options.hydration.serverAdapterModule) {
		const importPath = makeProjectImportSpecifier(
			routeFilePath,
			options.hydration.serverAdapterModule,
		);
		const exportName = options.hydration.serverAdapterExportName ?? "default";
		if (exportName === "default") {
			return `import hydrationServerAdapter from "${importPath}";`;
		}
		return `import { ${exportName} as hydrationServerAdapter } from "${importPath}";`;
	}

	const importPath = ensureImportSpecifier(
		routeFilePath,
		runtimeServerAdapterPath,
	);
	return `import hydrationServerAdapter from "${importPath}";`;
}

function makeClientAdapterImport(
	options: ResolvedOptions,
	clientFilePath: string,
	runtimeClientAdapterPath: string,
): string {
	if (options.hydration.clientAdapterModule) {
		const importPath = makeProjectImportSpecifier(
			clientFilePath,
			options.hydration.clientAdapterModule,
		);
		const exportName = options.hydration.clientAdapterExportName ?? "default";
		if (exportName === "default") {
			return `import hydrationClientAdapter from "${importPath}";`;
		}
		return `import { ${exportName} as hydrationClientAdapter } from "${importPath}";`;
	}

	const importPath = ensureImportSpecifier(
		clientFilePath,
		runtimeClientAdapterPath,
	);
	return `import hydrationClientAdapter from "${importPath}";`;
}

type ResolvedOptions = {
	basePath: string;
	generatedDir: string;
	publicClientPath: string;
	parseOutput?: ParseOutputModuleConfig;
	verbose: boolean;
	hydration: Required<HydrationConfig>;
};

function resolveOptions(
	options: CloudflarePagesDynamicSSROptions,
): ResolvedOptions {
	return {
		basePath: options.basePath ?? "pages",
		generatedDir: options.generatedDir ?? DEFAULT_GENERATED_DIR,
		publicClientPath: options.publicClientPath ?? DEFAULT_PUBLIC_CLIENT_PATH,
		parseOutput: options.parseOutput,
		verbose: options.verbose ?? false,
		hydration: {
			mountSelector: options.hydration?.mountSelector ?? DEFAULT_MOUNT_SELECTOR,
			payloadElementId:
				options.hydration?.payloadElementId ?? DEFAULT_PAYLOAD_ELEMENT_ID,
			serverAdapterModule: options.hydration?.serverAdapterModule ?? "",
			serverAdapterExportName:
				options.hydration?.serverAdapterExportName ?? "default",
			clientAdapterModule: options.hydration?.clientAdapterModule ?? "",
			clientAdapterExportName:
				options.hydration?.clientAdapterExportName ?? "default",
		},
	};
}

async function generateArtifacts(
	resolvedOptions: ResolvedOptions,
): Promise<GenerationState> {
	const cwd = process.cwd();
	const baseDir = resolve(cwd, resolvedOptions.basePath);
	const generatedDir = resolve(cwd, resolvedOptions.generatedDir);

	rmSync(generatedDir, { recursive: true, force: true });
	mkdirSync(generatedDir, { recursive: true });

	await writeRuntimeFiles(generatedDir);

	const files = await discoverDynamicPages(baseDir);
	const plans: DynamicRoutePlan[] = [];
	const functionEntrypoints: string[] = [];
	const clientEntrypoints: string[] = [];

	for (const filePath of files) {
		const routePath = makeRoutePath(baseDir, filePath);
		const routeKey = routeToKey(routePath);
		const functionFile = join(
			generatedDir,
			"functions",
			routeToEntryFile(routePath),
		);
		const clientFile = join(generatedDir, "client", `${routeKey}.ts`);
		const clientPublicPath = `${resolvedOptions.publicClientPath}/${routeKey}.js`;

		plans.push({
			filePath,
			routePath,
			functionEntrypoint: functionFile,
			clientEntrypoint: clientFile,
			clientPublicPath,
			routeKey,
		});

		functionEntrypoints.push(functionFile);
		clientEntrypoints.push(clientFile);

		const runtimeServerPath = join(generatedDir, "runtime", "server.ts");
		const runtimeDefaultServerAdapterPath = join(
			generatedDir,
			"runtime",
			"default-server-adapter.ts",
		);
		const pageImportPath = ensureImportSpecifier(functionFile, filePath);

		const parseOutputImportLine = resolvedOptions.parseOutput
			? `${parseOutputImport(resolvedOptions.parseOutput, functionFile)}\n`
			: "";

		const serverAdapterImportLine = makeServerAdapterImport(
			resolvedOptions,
			functionFile,
			runtimeDefaultServerAdapterPath,
		);

		await writeFileWithParents(
			functionFile,
			`import Page from "${pageImportPath}";
import { renderDynamicPage } from "${ensureImportSpecifier(functionFile, runtimeServerPath)}";
${serverAdapterImportLine}
${parseOutputImportLine}export const onRequest = (context: { request: Request; params?: Record<string, unknown> }) => {
  return renderDynamicPage({
    context,
    routePath: ${JSON.stringify(routePath)},
    clientScriptPath: ${JSON.stringify(clientPublicPath)},
    mountSelector: ${JSON.stringify(resolvedOptions.hydration.mountSelector)},
    payloadElementId: ${JSON.stringify(resolvedOptions.hydration.payloadElementId)},
    Page,
    hydrationServerAdapter,
${resolvedOptions.parseOutput ? "    parseOutput,\n" : ""}  });
};
`,
		);

		const runtimeDefaultClientAdapterPath = join(
			generatedDir,
			"runtime",
			"default-client-adapter.ts",
		);
		const clientAdapterImport = makeClientAdapterImport(
			resolvedOptions,
			clientFile,
			runtimeDefaultClientAdapterPath,
		);

		await writeFileWithParents(
			clientFile,
			`import Page from "${ensureImportSpecifier(clientFile, filePath)}";
${clientAdapterImport}

const payloadNode = document.getElementById(${JSON.stringify(
				resolvedOptions.hydration.payloadElementId,
			)});
const mountElement = document.querySelector(${JSON.stringify(
				resolvedOptions.hydration.mountSelector,
			)});

if (payloadNode && mountElement) {
  const payload = JSON.parse(payloadNode.textContent || "{}");
  hydrationClientAdapter({
    Component: Page,
    payload,
    mountElement,
  });
}
`,
		);
	}

	return {
		plans,
		entrypoints: [...functionEntrypoints, ...clientEntrypoints],
		generatedDir,
	};
}

/**
 * cloudflare-pages-dynamic-ssr - Frame-Master Plugin
 */
export default function cloudflarePagesDynamicSSR(
	options: CloudflarePagesDynamicSSROptions = {},
): FrameMasterPlugin {
	const resolvedOptions = resolveOptions(options);
	let state: GenerationState = {
		plans: [],
		entrypoints: [],
		generatedDir: resolve(process.cwd(), resolvedOptions.generatedDir),
	};

	return {
		name,
		version,

		directives: [
			{
				name: "use-dynamic",
				regex: USE_DYNAMIC_REGEX,
			},
		],

		build: {
			enableLoging: resolvedOptions.verbose,
			buildConfig: async () => {
				state = await generateArtifacts(resolvedOptions);
				return {
					entrypoints: state.entrypoints,
				};
			},
			beforeBuild: async () => {
				if (state.entrypoints.length === 0) {
					state = await generateArtifacts(resolvedOptions);
				}
			},
			afterBuild: async () => {
				if (!resolvedOptions.verbose) {
					return;
				}
				console.log(
					`[cloudflare-pages-dynamic-ssr] Generated ${state.plans.length} dynamic routes in ${state.generatedDir}`,
				);
			},
		},

		router: {
			before_request: async () => {},
			request: async () => {},
			after_request: async () => {},
			html_rewrite: {
				initContext: () => ({}),
				rewrite: async () => {},
				after: async () => {},
			},
		},

		serverStart: {
			main: async () => {
				if (resolvedOptions.verbose) {
					console.log("cloudflare-pages-dynamic-ssr initialized");
				}
			},
			dev_main: async () => {
				if (resolvedOptions.verbose) {
					console.log(
						"cloudflare-pages-dynamic-ssr running in development mode",
					);
				}
			},
		},

		requirement: {
			frameMasterVersion: ">=3.1.1",
			bunVersion: ">=1.3.10",
		},
	};
}

export const __internal = {
	hasUseDynamicDirective,
	hasDefaultExportedFunction,
	makeRoutePath,
	routeToEntryFile,
	routeToKey,
};
