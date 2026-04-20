import { describe, expect, test } from "bun:test";
import { __internal } from "../index";

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
});
