import { join, relative, extname } from "node:path";
import { watch } from "node:fs";
import {
	type Directives,
	type FrameMasterPlugin,
	getGlobalPluginContext,
} from "frame-master/plugin";
import { isDev } from "frame-master/utils";
import {
	createDirective,
	directiveToolSingleton,
} from "frame-master/plugin/utils";
import { name, version, peerDependencies } from "./package.json";
import type { RequestContextData } from "./src/provider/shared";
import "frame-master-plugin-build-unifier";
import type { JSX } from "react";
import type { LoaderManager, PluginEventContext } from "./src/server";

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
	/**
	 * Custom entrypoint matcher for the file router. By default, the plugin will look for files with .tsx and .jsx extensions
	 * with file directive "use-dynamic".
	 *
	 * Example:
	 * ```javascript
	 * /.*layout\.(jsx|tsx)$/
	 * ```
	 * to match all layout files with .jsx or .tsx extensions. You can also use string patterns, for example:
	 * ```javascript
	 * "layout.jsx"
	 * ```
	 * to match all files named layout.jsx.
	 *
	 * these files can be retrived with:
	 * ```typescript
	 * import MyCustomEntryPoints from "dynamic-ssr:entrypoints";
	 *
	 * // { [relativePath]: ModuleExports }
	 * type MyCustomEntryPoints = Record<string, Record<string, unknown>>;
	 *
	 *
	 * ```
	 */
	entrypointMatcher?: Array<RegExp | string>;
};

const cwd = process.cwd();

/**
 * cloudflare-pages-dynamic-ssr - Frame-Master Plugin
 */
export default function cloudflarePagesDynamicSSR(
	options: CloudflarePagesDynamicSSROptions,
): FrameMasterPlugin {
	const {
		actionBasePath,
		basePath = "src/pages",
		entrypointMatcher = [],
	} = options;

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

	const getCustomEntrypoints = (matcher: Array<RegExp | string>) => {
		return matcher.flatMap((pattern) => {
			if (typeof pattern === "string") {
				return Array.from(
					new Bun.Glob(`**/${pattern}`).scanSync({
						cwd: basePath,
						onlyFiles: true,
						absolute: true,
					}),
				);
			} else {
				return Array.from(
					new Bun.Glob(`**/*`).scanSync({
						cwd: basePath,
						onlyFiles: true,
						absolute: true,
					}),
				).filter((file) => pattern.test(file));
			}
		});
	};

	const buildRoutes = async () =>
		getGlobalPluginContext("build-unifier")
			?.getBuilder?.(name)
			.then(async (builder) => {
				if (!builder.isBuilding()) {
					return builder.build();
				} else return builder.awaitBuildFinish();
			});

	let isDynamicModuleBuild = false;

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
			getGlobalPluginContext("build-unifier")?.setBuildConfig?.(name, {
				buildConfig: async () => {
					const filePathsList = await getDynamicFiles();
					const relativeFilePathsList = filePathsList.map((fp) =>
						relative(join(cwd, basePath), fp),
					);
					const pageToActionFilePathList = relativeFilePathsList.map(
						(relativeFilePath) => join(actionBasePath, relativeFilePath),
					);

					/*console.log({
						relativeFilePathsList,
						filePathsList,
						pageToActionFilePathList,
					});*/

					// Mock vaiables for the generated action files
					const PageModule = {
						default: () => null as unknown as JSX.Element,
					} as unknown as {
						//@ts-expect-error
						default: () => JSX.Element;
						[key: string]: LoaderManager<unknown>;
					};

					const onRequestGet: PagesFunction<
						{ NODE_ENV: string },
						never,
						RequestContextData
					> = async (ctx) => {
						const acceptedTypes = ctx.request.headers
							.get("accept")
							?.includes("application/vnd.ssr.props+json")
							? "props"
							: "html";
						const pathname = new URL(ctx.request.url).pathname;
						const header = new Headers();
						if (acceptedTypes === "props") {
							header.set(
								"content-type",
								"application/vnd.ssr.props+json; charset=utf-8",
							);
							const propsData =
								process.env.NODE_ENV === "development"
									? null
									: await ctx.data.storeProvider.get.props(pathname);
							if (propsData) return Response.json(propsData);
							const { props } = await ctx.data.storeProvider.set({
								pathname,
								module: PageModule,
								parser: ctx.data.parser,
								ctx,
							});
							return Response.json(props);
						} else {
							header.set("content-type", "text/html; charset=utf-8");
						}

						const storeProvider = ctx.data.storeProvider;

						let storedData =
							ctx.env.NODE_ENV === "development"
								? null
								: await storeProvider.get.page(pathname);

						if (!storedData) {
							storedData = await storeProvider
								.set({
									pathname,
									module: {
										default: PageModule.default,
									},
									parser: ctx.data.parser,
									ctx,
								})
								.then(({ html }) => html);
						}

						return new Response(storedData?.data, {
							status: 200,
							headers: header,
						});
					};

					const files = await Promise.all(
						pageToActionFilePathList.map((fp) => {
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
						}),
					);

					const customExtFiles = files.reduce(
						(acc, file) => {
							const splited = file.filePath.split(".");
							splited.pop();
							splited.push("cfdynamicssr");
							acc[splited.join(".")] = file.content;
							return acc;
						},
						{} as Record<string, string>,
					);
					const customEntrypoints = getCustomEntrypoints(entrypointMatcher);
					return {
						entrypoints: Object.keys(customExtFiles),
						files: {
							...customExtFiles,
							"@cf-dynamic-ssr/custom-entrypoints.cfdynamicentrypoints": `
							${customEntrypoints.map((fp, i) => `import * as _$${i} from "${fp}";`).join("\n")}

							const customEntrypoints = {
								${customEntrypoints
									.map(
										(fp, i) => `"${relative(join(cwd, basePath), fp)}": _$${i}`,
									)
									.join(",\n")}
							};
							export default customEntrypoints;
							`,
						},
						target: "browser",
						loader: {
							".cfdynamicssr": "tsx",
							".cfdynamicentrypoints": "ts",
						},
						plugins: [
							{
								name: "dynamic-ssr-import-custom-entrypoints",
								setup(build) {
									build.onResolve(
										{
											filter: /dynamic-ssr:entrypoints/,
										},
										(args) => {
											return {
												path: args.path,
												namespace: "dynamic-ssr-custom-entrypoints",
											};
										},
									);
									build.onLoad(
										{
											filter: /dynamic-ssr:entrypoints/,
											namespace: "dynamic-ssr-custom-entrypoints",
										},
										async () => {
											return {
												contents: `export { default } from "@cf-dynamic-ssr/custom-entrypoints.cfdynamicentrypoints";`,
												loader: "js",
											};
										},
									);
								},
							},
						],
					};
				},
			});
		},
		build: {
			async beforeBuild() {
				if (!isDynamicModuleBuild) {
					return;
				}
				isDynamicModuleBuild = false;
				await new Promise<void>((resolve) => {
					const watcher = watch(
						join(cwd, ".wrangler", "tmp"),
						{ recursive: true },
						() => {
							watcher.close();
							resolve();
						},
					);
				});
				await Bun.sleep(1000);
			},
			buildConfig: {
				plugins: [
					{
						name: "transform-dynamic-page-module",
						setup(build) {
							const createTranspiler = (
								replace: Record<string, string>,
								autoImportJSX: boolean,
							) =>
								new Bun.Transpiler({
									exports: {
										replace,
									},
									deadCodeElimination: false,
									treeShaking: false,
									trimUnusedImports: false,
									loader: "tsx",
									autoImportJSX,
								});

							const scanner = new Bun.Transpiler({ loader: "tsx" });
							build.onLoad({ filter: /\.(jsx|tsx)$/ }, async (args) => {
								const isDynamicModule = await directiveToolSingleton.pathIs(
									"use-dynamic" as Directives,
									args.path,
								);
								if (!isDynamicModule) return;

								const contents =
									(args.__chainedContents as string) ??
									(await Bun.file(args.path).text());

								const moduleLoaderData = scanner.scan(contents);

								const moduleLoaderLoaderExports =
									moduleLoaderData.exports.filter((exp) =>
										exp.startsWith("loader_"),
									);

								let transpiled = createTranspiler(
									Object.fromEntries(
										moduleLoaderLoaderExports.map((loader) => [
											loader,
											`__$${loader}`,
										]),
									),
									!moduleLoaderData.imports.find((imp) => imp.path === "react"),
								).transformSync(
									contents,
									(args.__chainedLoader as Bun.JavaScriptLoader) ??
										(args.loader as Bun.JavaScriptLoader),
								);

								const relativePath = relative(join(cwd, basePath), args.path);
								const ext = extname(args.path);
								const relativePathExtLess = relativePath.slice(0, -ext.length);
								const relativePathname = relativePathExtLess.endsWith("/index")
									? relativePathExtLess.slice(0, -"/index".length)
									: relativePathExtLess;

								for (const loader_name of moduleLoaderLoaderExports) {
									transpiled = transpiled.replaceAll(
										`"__$${loader_name}"`,
										`await fetch(
											"/${relativePathname}", 
											{ 
												headers: { 
											 		"Accept": "application/vnd.ssr.props+json" 
												} 
											})
											.then(res => res.json())
											.then(({ data }) => data.find(i => i.name === "${loader_name}")?.data)
											`,
									);
								}

								return {
									contents: transpiled,
									loader: "tsx",
								};
							});
						},
					},
				],
			},
		},
		async onFileSystemChange(_ev, _fp, abs) {
			directiveToolSingleton.clearPaths();
			if (
				!(await directiveToolSingleton.pathIs("use-dynamic" as Directives, abs))
			)
				return;
			isDynamicModuleBuild = true;
			await buildRoutes();
		},
	};
}
