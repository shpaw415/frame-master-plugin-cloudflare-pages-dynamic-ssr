import { join, relative } from "node:path";
import {
	type Directives,
	type FrameMasterPlugin,
	getGlobalPluginContext,
} from "frame-master/plugin";
import {
	createDirective,
	directiveToolSingleton,
} from "frame-master/plugin/utils";
import { name, version, peerDependencies } from "./package.json";
import type { RequestContextData } from "./src/provider/shared";
import "frame-master-plugin-build-unifier";
import type { JSX } from "react";

declare module "frame-master/plugin/utils" {
	interface CustomDirectives {
		"use-dynamic": true;
	}
}

export type CloudflarePagesDynamicSSROptions = {
	/**
	 * action path for dynamic page files. This is the base path that will be used to serve the dynamic page files.
	 */
	actionBasePath: string;
	/**
	 * base path for scanning dynamic page files. This is the base path that the plugin will use to scan for dynamic page files in your project. The default value is "src/pages". You can change this to any directory you want, but make sure to update your Cloudflare Pages Functions configuration accordingly to point to the correct path for your dynamic page files.
	 */
	basePath?: string;
	/**
	 * Wrangler dev server config. from **`frame-master-plugin-cloudflare-pages-functions-action`**
	 */
	wrangler: {
		port: number | string;
	};
};

const cwd = process.cwd();

type WranglerConfig = {
	kv_namespaces?: {
		binding: string;
		id: string;
	}[];
};

async function getWranglerFile() {
	const wranglerFile = Bun.file(join(cwd, "wrangler.json"));
	if (await wranglerFile.exists()) {
		return wranglerFile.json() as Promise<WranglerConfig>;
	}
	const wranglerJsonC = Bun.file(join(cwd, "wrangler.jsonc"));
	if (await wranglerJsonC.exists()) {
		return wranglerJsonC.json() as Promise<WranglerConfig>;
	}
	throw new Error(
		"wrangler.json or wrangler.jsonc not found in the project root. Please make sure you have a wrangler.json or wrangler.jsonc file in your project root.",
	);
}

async function checkConfig() {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const wranglerFile = await getWranglerFile();
	if (
		!wranglerFile.kv_namespaces?.some(
			(namespace) => namespace.binding === "DYNAMIC_PAGE_KV",
		)
	) {
		throw new Error(
			"KV namespace binding 'DYNAMIC_PAGE_KV' not found in wrangler configuration. Please add a KV namespace with the binding name 'DYNAMIC_PAGE_KV' to your wrangler configuration.",
		);
	}
}

/**
 * cloudflare-pages-dynamic-ssr - Frame-Master Plugin
 */
export default function cloudflarePagesDynamicSSR(
	options: CloudflarePagesDynamicSSROptions,
): FrameMasterPlugin {
	const { actionBasePath, basePath = "src/pages" } = options;

	const directive = createDirective(
		"use-dynamic" as Directives,
		/^(?:\s*(?:\/\/.*?\n|\s)*)?['"]use[-\s]dynamic['"];?\s*(?:\/\/.*)?(?:\r?\n|$)/m,
	);
	if (process.env.__PLUGIN_NODE_ENV__ === "development") {
		directiveToolSingleton.addDirective(directive.name, directive.regex);
	}

	const getDynamicFiles = () =>
		Promise.all(
			Array.from(
				new Bun.Glob("**/*.{jsx,tsx}").scanSync({
					cwd: basePath,
					onlyFiles: true,
					absolute: true,
				}),
			).map(async (file) =>
				(await directiveToolSingleton.pathIs(directive.name, file))
					? file
					: null,
			),
		).then((files) => files.filter((f) => f !== null));

	const buildRoutes = async () =>
		getGlobalPluginContext("build-unifier")
			?.getBuilder?.(name)
			.then(async (builder) => {
				if (!builder.isBuilding()) {
					return builder.build();
				} else return builder.awaitBuildFinish();
			});

	return {
		name,
		version,
		directives: [directive],
		priority: -2,
		requirement: {
			frameMasterVersion: peerDependencies["frame-master"],
			bunVersion: ">=1.3.10",
			frameMasterPlugins: {
				"frame-master-plugin-cloudflare-pages-functions-action":
					peerDependencies[
						"frame-master-plugin-cloudflare-pages-functions-action"
					],
				"frame-master-plugin-build-unifier":
					peerDependencies["frame-master-plugin-build-unifier"],
			},
		},
		async createContext() {
			await checkConfig();
			getGlobalPluginContext("build-unifier")?.setBuildConfig?.(name, {
				buildConfig: async () => {
					const filePathsList = await getDynamicFiles();
					const relativeFilePathsList = filePathsList.map((fp) =>
						relative(join(cwd, basePath), fp),
					);
					const pageToActionFilePathList = relativeFilePathsList.map(
						(relativeFilePath) => join(actionBasePath, relativeFilePath),
					);
					/*
					console.log({
						relativeFilePathsList,
						filePathsList,
						pageToActionFilePathList,
					});
					*/

					// Mock vaiables for the generated action files
					const PageModule: {
						default: () => JSX.Element | Promise<JSX.Element>;
					} = {
						default: () => null as unknown as JSX.Element,
					};

					const onRequestGet: PagesFunction<
						never,
						never,
						RequestContextData
					> = async (ctx) => {
						const accept = ctx.request.headers.get("accept") || "";
						const pathname = new URL(ctx.request.url).pathname;
						const header = new Headers();
						let type: "html" | "javascript";
						if (accept.includes("application/javascript")) {
							type = "javascript";
							header.set(
								"content-type",
								"application/javascript; charset=utf-8",
							);
						} else {
							header.set("content-type", "text/html; charset=utf-8");
							type = "html";
						}

						const storeProvider = ctx.data.storeProvider;
						const HTMLParser =
							ctx.data.parser?.html ??
							((html: string) =>
								`<html><head></head><body>${html}</body></html>`);
						const ModuleParser =
							ctx.data.parser?.module ??
							((moduleString: string) => moduleString);
						let storedData = await storeProvider.get(pathname);

						if (!storedData) {
							storedData = await storeProvider.set(pathname, {
								default: PageModule.default,
							});
						}

						return new Response(
							type === "javascript"
								? ModuleParser(storedData.module, PageModule)
								: HTMLParser(storedData.html),
							{
								status: 200,
								headers: header,
							},
						);
					};

					await Promise.all(
						pageToActionFilePathList
							.map((fp) => {
								const realPath = join(
									cwd,
									basePath,
									relative(actionBasePath, fp),
								);
								return {
									filePath: fp,
									content: `
								"no-action";
								import * as PageModule from "${realPath}";
								export const onRequest = ${onRequestGet.toString()};
										`,
								};
							})
							.map(({ filePath, content }) => {
								return Bun.file(filePath).write(content);
							}),
					);

					return {
						entrypoints: pageToActionFilePathList,
						minify: process.env.NODE_ENV === "production",
						target: "browser",
						splitting: true,
					};
				},
			});
		},
		build: {
			buildConfig: {
				plugins: [
					{
						name: "transform-dynamic-page-module",
						setup(build) {
							build.onLoad({ filter: /\.(jsx|tsx)$/ }, async (args) => {
								const isDynamicModule = await directiveToolSingleton.pathIs(
									"use-dynamic" as Directives,
									args.path,
								);

								if (!isDynamicModule) return;

								return {
									contents: `
										import PageComponent from "${relative(join(cwd, basePath), args.path.replace(/\.(jsx|tsx)$/, ""))}";
										export default PageComponent;
										`,
									loader: "js",
								};
							});
						},
					},
				],
			},
		},
		async onFileSystemChange(ev, _fp, abs) {
			console.log(`File system change detected: ${ev} - ${abs}`);
			if (
				await directiveToolSingleton.pathIs("use-dynamic" as Directives, abs)
			) {
				console.log(
					`File system change detected in dynamic page file: ${abs}. Rebuilding dynamic pages...`,
				);
				await buildRoutes();
			}
		},
	};
}
