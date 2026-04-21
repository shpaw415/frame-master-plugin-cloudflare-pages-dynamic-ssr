# cloudflare-pages-dynamic-ssr

Frame-Master plugin

## Installation

```bash
bun add cloudflare-pages-dynamic-ssr
```

## Usage

```typescript
import type { FrameMasterConfig } from "frame-master/server/types";
import cloudflarepagesdynamicssr from "cloudflare-pages-dynamic-ssr";

const config: FrameMasterConfig = {
  HTTPServer: { port: 3000 },
  plugins: [
    cloudflarepagesdynamicssr({
      basePath: "pages",
      publicClientPath: "/_dynamic",
      hydration: {
        mountSelector: "#app",
        payloadElementId: "__FM_DYNAMIC_PAYLOAD__",
      },
    }),
  ],
};

export default config;
```

## Features

- Scans `.tsx` and `.jsx` files under `basePath` during build.
- Includes only pages with a top-file `"use-dynamic"` directive.
- Validates that each matched file default-exports a function component.
- Generates Cloudflare Pages `functions/` entrypoints from file-based routes.
- Generates matching client hydration entries for full-page React hydration.
- Uses a modular hydration adapter contract so hydration logic is reusable.
- Supports optional `parseOutput` hook to transform final HTML at Cloudflare runtime.

The generated `functions/` directory is always written at the root of the project to match Cloudflare Pages Functions conventions.

## Route Mapping

The plugin derives routes from paths relative to `basePath`:

- `pages/index.tsx` -> `/`
- `pages/about.tsx` -> `/about`
- `pages/blog/index.tsx` -> `/blog`
- `pages/users/[id].tsx` -> `/users/[id]`

## Required Page Directive

Only files that start with the directive are transformed:

```tsx
"use-dynamic";

export default function Page() {
  return <main>Hello dynamic page</main>;
}
```

Files without `"use-dynamic"` are ignored.

## Options

```ts
type ParseOutputModuleConfig = {
  module: string;
  exportName?: string; // default: "default"
};

type HydrationConfig = {
  mountSelector?: string; // default: "#app"
  payloadElementId?: string; // default: "__FM_DYNAMIC_PAYLOAD__"
  serverAdapterModule?: string;
  serverAdapterExportName?: string; // default: "default"
  clientAdapterModule?: string;
  clientAdapterExportName?: string; // default: "default"
};

type CloudflarePagesDynamicSSROptions = {
  basePath?: string; // default: "pages"
  generatedDir?: string; // default: ".frame-master/generated/cloudflare-pages-dynamic-ssr" (internal client/runtime assets only)
  publicClientPath?: string; // default: "/_dynamic"
  parseOutput?: ParseOutputModuleConfig;
  hydration?: HydrationConfig;
  verbose?: boolean; // default: false
};
```

`generatedDir` does not move the Cloudflare Pages `functions/` output. It only controls where the plugin stores its internal generated client and runtime helper modules.

## Reusable Hydration Adapters

Hydration is implemented through shared runtime helpers that are reused across generated routes.
You can replace the defaults by providing custom adapter modules via `hydration.serverAdapterModule`
and `hydration.clientAdapterModule`.

Server adapter contract:

```ts
type ServerHydrationAdapterArgs = {
  pageHtml: string;
  payloadJson: string;
  payloadElementId: string;
  mountSelector: string;
  clientScriptPath: string;
};

export default function hydrationServerAdapter(args: ServerHydrationAdapterArgs): string;
```

Client adapter contract:

```ts
type ClientHydrationAdapterArgs = {
  Component: unknown;
  payload: Record<string, unknown>;
  mountElement: Element;
};

export default function hydrationClientAdapter(args: ClientHydrationAdapterArgs): void;
```

Small example custom adapters are available in [docs/examples/custom-hydration/server-adapter.ts](docs/examples/custom-hydration/server-adapter.ts), [docs/examples/custom-hydration/client-adapter.ts](docs/examples/custom-hydration/client-adapter.ts), and [docs/examples/custom-hydration/README.md](docs/examples/custom-hydration/README.md).

Example configuration:

```ts
cloudflarepagesdynamicssr({
  hydration: {
    serverAdapterModule: "./docs/examples/custom-hydration/server-adapter.ts",
    clientAdapterModule: "./docs/examples/custom-hydration/client-adapter.ts",
  },
});
```

## Optional HTML Output Parser

If `parseOutput` is configured, the generated Cloudflare function imports your module and calls it
after SSR HTML generation and before returning the final `Response`.

```ts
// parse-output.ts
export default function parseOutput(html: string, context: {
  routePath: string;
  pathname: string;
  params: Record<string, unknown>;
}) {
  return html.replace("</head>", "<meta name=\"x-dynamic\" content=\"1\" /></head>");
}
```

```ts
cloudflarepagesdynamicssr({
  parseOutput: {
    module: "./parse-output.ts",
  },
});
```

## License

MIT
