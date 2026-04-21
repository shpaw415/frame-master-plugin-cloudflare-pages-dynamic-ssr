import { mkdtempSync, existsSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { describe, expect, test } from "bun:test";
import cloudflarePagesDynamicSSR, { __internal } from "../index";

describe("cloudflare-pages-dynamic-ssr internals", () => {
	test("detects top-file use-dynamic directive", () => {
		expect(
			__internal.hasUseDynamicDirective(
				'"use-dynamic";\nexport default function Page() {}',
			),
		).toBeTrue();
		expect(
			__internal.hasUseDynamicDirective(
				"// comment\n'use-dynamic';\nexport default () => null;",
			),
		).toBeTrue();
	});

	test("ignores files without use-dynamic directive", () => {
		expect(
			__internal.hasUseDynamicDirective("export default function Page() {}\n"),
		).toBeFalse();
	});

	test("accepts supported default export function shapes", () => {
		expect(
			__internal.hasDefaultExportedFunction(
				"export default function Page() { return null; }",
				"/tmp/page.tsx",
			),
		).toBeTrue();

		expect(
			__internal.hasDefaultExportedFunction(
				"const Page = () => null; export default Page;",
				"/tmp/page.jsx",
			),
		).toBeTrue();

		expect(
			__internal.hasDefaultExportedFunction(
				"export default () => null;",
				"/tmp/page.tsx",
			),
		).toBeTrue();
	});

	test("rejects non-function default export", () => {
		expect(
			__internal.hasDefaultExportedFunction(
				"export default 123;",
				"/tmp/page.tsx",
			),
		).toBeFalse();
	});

	test("maps pages file paths to routes", () => {
		expect(
			__internal.makeRoutePath("/project/pages", "/project/pages/index.tsx"),
		).toBe("/");
		expect(
			__internal.makeRoutePath(
				"/project/pages",
				"/project/pages/blog/index.tsx",
			),
		).toBe("/blog");
		expect(
			__internal.makeRoutePath(
				"/project/pages",
				"/project/pages/users/[id].tsx",
			),
		).toBe("/users/[id]");
	});

	test("maps route paths to function entry filenames", () => {
		expect(__internal.routeToEntryFile("/")).toBe("index.ts");
		expect(__internal.routeToEntryFile("/about")).toBe("about.ts");
		expect(__internal.routeToEntryFile("/blog/post")).toBe("blog/post.ts");
	});

	test("builds stable route keys for generated assets", () => {
		expect(__internal.routeToKey("/")).toBe("root");
		expect(__internal.routeToKey("/blog/post")).toBe("blog__post");
	});

	test("generates files for a real pages fixture tree", async () => {
		const fixturePagesDir = resolve(
			process.cwd(),
			"tests/fixtures/basic/pages",
		);
		const projectRoot = mkdtempSync(
			join(tmpdir(), "cf-pages-dynamic-ssr-project-"),
		);
		const generatedDir = join(
			projectRoot,
			".frame-master/generated/cloudflare-pages-dynamic-ssr",
		);
		const originalCwd = process.cwd();

		try {
			mkdirSync(join(projectRoot, "pages", "blog"), { recursive: true });
			mkdirSync(join(projectRoot, "pages", "users"), { recursive: true });
			await Bun.write(
				join(projectRoot, "pages", "index.tsx"),
				await Bun.file(join(fixturePagesDir, "index.tsx")).text(),
			);
			await Bun.write(
				join(projectRoot, "pages", "about.tsx"),
				await Bun.file(join(fixturePagesDir, "about.tsx")).text(),
			);
			await Bun.write(
				join(projectRoot, "pages", "ignored.tsx"),
				await Bun.file(join(fixturePagesDir, "ignored.tsx")).text(),
			);
			await Bun.write(
				join(projectRoot, "pages", "blog", "index.tsx"),
				await Bun.file(join(fixturePagesDir, "blog", "index.tsx")).text(),
			);
			await Bun.write(
				join(projectRoot, "pages", "users", "[id].tsx"),
				await Bun.file(join(fixturePagesDir, "users", "[id].tsx")).text(),
			);

			process.chdir(projectRoot);

			const plugin = cloudflarePagesDynamicSSR({
				basePath: "pages",
				generatedDir,
				publicClientPath: "/_fixture-dynamic",
			});

			if (typeof plugin.build?.buildConfig !== "function") {
				throw new Error("Expected plugin buildConfig to be a function");
			}

			const config = await plugin.build.buildConfig(undefined as never);
			const entrypoints = Array.isArray(config.entrypoints)
				? config.entrypoints
				: [];
			const rootFunctionsDir = join(projectRoot, "functions");

			const expectedFiles = [
				join(rootFunctionsDir, "index.ts"),
				join(rootFunctionsDir, "about.ts"),
				join(rootFunctionsDir, "blog.ts"),
				join(rootFunctionsDir, "users", "[id].ts"),
				join(generatedDir, "client", "root.ts"),
				join(generatedDir, "client", "about.ts"),
				join(generatedDir, "client", "blog.ts"),
				join(generatedDir, "client", "users__[id].ts"),
				join(generatedDir, "runtime", "server.ts"),
				join(generatedDir, "runtime", "default-server-adapter.ts"),
				join(generatedDir, "runtime", "default-client-adapter.ts"),
			];

			for (const filePath of expectedFiles) {
				expect(existsSync(filePath)).toBeTrue();
			}

			expect(existsSync(join(rootFunctionsDir, "ignored.ts"))).toBeFalse();
			expect(entrypoints).toContain(join(rootFunctionsDir, "index.ts"));
			expect(entrypoints).toContain(join(generatedDir, "client", "root.ts"));

			const generatedServerRoute = await Bun.file(
				join(rootFunctionsDir, "users", "[id].ts"),
			).text();
			expect(
				generatedServerRoute.includes('routePath: "/users/[id]"'),
			).toBeTrue();
			expect(
				generatedServerRoute.includes(
					'clientScriptPath: "/_fixture-dynamic/users__[id].js"',
				),
			).toBeTrue();

			const generatedClientRoute = await Bun.file(
				join(generatedDir, "client", "root.ts"),
			).text();
			expect(
				generatedClientRoute.includes("hydrationClientAdapter"),
			).toBeTrue();
		} finally {
			process.chdir(originalCwd);
			rmSync(projectRoot, { recursive: true, force: true });
		}
	});
});
