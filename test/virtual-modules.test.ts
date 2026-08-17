import { afterEach, expect, test } from "bun:test";
import { join } from "node:path";
import {
	createPluginTestEnv,
	type PluginTestEnv,
	withTempDir,
	writeFixture,
} from "frame-master/testing";
import BuildUnifier from "frame-master-plugin-build-unifier";
import CFActionPlugin from "frame-master-plugin-cloudflare-pages-functions-action";
import cloudflarePagesDynamicSSR from "../index";

let env: PluginTestEnv | undefined;

afterEach(async () => {
	await env?.dispose();
	env = undefined;
});

function createPlugins(dir: string) {
	return BuildUnifier({
		plugins: [
			CFActionPlugin({
				actionBasePath: join(dir, "actions"),
				outDir: join(dir, ".frame-master/build"),
			}),
			cloudflarePagesDynamicSSR({
				actionBasePath: join(dir, "actions"),
				basePath: join(dir, "pages"),
				wrangler: { port: 8787 },
			}),
		],
	});
}

test("resolves custom entrypoints through the Frame-Master virtual module registry", async () => {
	await withTempDir(async (dir) => {
		await writeFixture(dir, "pages/.keep", "");
		await writeFixture(dir, "actions/.keep", "");
		const entrypoint = await writeFixture(
			dir,
			"entry.ts",
			`import entrypoints from "dynamic-ssr:entrypoints"; export default entrypoints;`,
		);
		env = await createPluginTestEnv({
			cwd: dir,
			startServer: false,
			runCreateContext: false,
			runServerStart: false,
			plugins: createPlugins(dir),
		});

		const output = await env.build({ entrypoints: [entrypoint] });
		expect(output.success).toBe(true);
	});
});

test("loads entrypoints through the v4 runtime virtual-module registry", async () => {
	await withTempDir(async (dir) => {
		await writeFixture(dir, "pages/.keep", "");
		await writeFixture(dir, "actions/.keep", "");
		env = await createPluginTestEnv({
			cwd: dir,
			startServer: false,
			runCreateContext: false,
			runServerStart: false,
			plugins: createPlugins(dir),
		});

		const registry = env.pluginLoader.getVirtualModuleRegistry();
		const runtimePlugin = registry.createPlugin(true);
		expect(runtimePlugin).not.toBeNull();

		const entrypointsModule = registry.getModule("dynamic-ssr:entrypoints");
		expect(entrypointsModule?.injectRuntime).toBe(true);
		expect(typeof entrypointsModule?.contents).toBe("function");
		const generated = (entrypointsModule?.contents as () => string)();
		expect(generated).toContain("export default customEntrypoints");
	});
});

test("generates endpoints through a virtual-module contents factory", async () => {
	await withTempDir(async (dir) => {
		await writeFixture(
			dir,
			"pages/hello.tsx",
			`"use dynamic";
export default function Hello() { return null; }
`,
		);
		await writeFixture(dir, "actions/.keep", "");
		env = await createPluginTestEnv({
			cwd: dir,
			startServer: false,
			runCreateContext: false,
			runServerStart: false,
			plugins: createPlugins(dir),
		});

		const endpointsModule = env.pluginLoader
			.getVirtualModuleRegistry()
			.getModule("@dynamic-ssr-endpoints.js");
		expect(endpointsModule).toBeDefined();
		expect(typeof endpointsModule?.contents).toBe("function");
		const generated = await (
			endpointsModule?.contents as () => Promise<string>
		)();
		expect(generated).toContain('"/hello"');
	});
});
