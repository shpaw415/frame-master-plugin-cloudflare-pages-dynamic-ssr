import { expect, test } from "bun:test";
import { join } from "node:path";
import {
	createPluginTestEnv,
	withTempDir,
	writeFixture,
} from "frame-master/testing";
import type { FrameMasterPlugin } from "frame-master/plugin";
import cloudflarePagesDynamicSSR from "../index";

const requiredPlugins: FrameMasterPlugin[] = [
	{
		name: "frame-master-plugin-build-unifier",
		version: "1.0.0",
	},
	{
		name: "frame-master-plugin-cloudflare-pages-functions-action",
		version: "3.0.0",
	},
];

test("resolves custom entrypoints through the Frame-Master virtual module registry", async () => {
	await withTempDir(async (dir) => {
		await writeFixture(dir, "pages/.keep", "");
		const entrypoint = await writeFixture(
			dir,
			"entry.ts",
			`import entrypoints from "dynamic-ssr:entrypoints"; export default entrypoints;`,
		);
		const plugin = cloudflarePagesDynamicSSR({
			actionBasePath: "actions",
			basePath: join(dir, "pages"),
			wrangler: { port: 8787 },
		});
		const { build: _build, ...pluginWithoutSSRBuild } = plugin;
		const env = await createPluginTestEnv({
			cwd: dir,
			startServer: false,
			runCreateContext: false,
			plugins: [
				...requiredPlugins,
				pluginWithoutSSRBuild,
			],
		});

		try {
			const output = await env.build({ entrypoints: [entrypoint] });
			expect(output.success).toBe(true);
		} finally {
			await env.dispose();
		}
	});
});
