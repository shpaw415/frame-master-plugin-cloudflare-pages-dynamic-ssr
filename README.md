# frame-master-plugin-cloudflare-pages-dynamic-ssr

A [Frame-Master](https://github.com/shpaw415/frame-master) plugin that enables server-side rendering (SSR) for dynamic React pages on [Cloudflare Pages](https://pages.cloudflare.com/). Pages marked with the `"use dynamic"` directive are rendered server-side, cached in Cloudflare KV or the Cache API, and hydrated on the client — with per-loader data injection and full support for dynamic route parameters.

Depends on [`frame-master-plugin-cloudflare-pages-functions-action`](https://github.com/shpaw415/frame-master-plugin-cloudflare-pages-functions-action) to compile the generated SSR handlers into Cloudflare Pages Functions.

---

## Installation

```bash
bun add frame-master-plugin-cloudflare-pages-dynamic-ssr
```

**Peer dependencies** (must also be installed):

```bash
bun add frame-master frame-master-plugin-cloudflare-pages-functions-action frame-master-plugin-build-unifier
```

---

## Setup

### 1. Configure the plugin (`frame-master.config.ts`)

```typescript
import type { FrameMasterConfig } from "frame-master/server/types";
import cloudflarePagesDynamicSSR from "frame-master-plugin-cloudflare-pages-dynamic-ssr";
import buildUnifier from "frame-master-plugin-build-unifier";
import CFActionPlugin from "frame-master-plugin-cloudflare-pages-functions-action";

const config: FrameMasterConfig = {
  HTTPServer: { port: 3000 },
  plugins: [
    ...buildUnifier({
      plugins: [
        cloudflarePagesDynamicSSR({
          actionBasePath: "src/actions", // where generated SSR action files are written
          basePath: "src/pages", // directory scanned for "use dynamic" pages (default: "src/pages")
          wrangler: { port: 8787 }, // Wrangler dev server port
        }),
        CFActionPlugin({
          actionBasePath: "src/actions",
          outDir: ".frame-master/build",
        }),
      ],
    }),
  ],
};

export default config;
```

### 2. Add a middleware file (`src/actions/_middleware.ts`)

This is the only file you need to add to your Cloudflare Pages Functions. It initialises the cache provider and is applied to every dynamic SSR route.

```typescript
import createMiddleware from "frame-master-plugin-cloudflare-pages-dynamic-ssr/middleware";
import KVProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/store/kv";

export const onRequest = createMiddleware<Env>((ctx) => ({
  storeProvider: KVProvider({ binding: ctx.env.DYNAMIC_PAGE_KV }),
}));
```

### 3. Add the KV namespace binding (`wrangler.jsonc`)

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "DYNAMIC_PAGE_KV",
      "id": "<your-kv-namespace-id>",
    },
  ],
}
```

### 4. Wrap your client shell with `SSRPropsProvider`

```tsx
// src/client-shell.tsx
import { RouterHost } from "frame-master-plugin-apply-react/router";
import { useRef, useState } from "react";
import { SSRPropsProvider } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/context";
import type { PropsData } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/utils";

export default function ClientShell({
  children,
}: {
  children: React.ReactElement;
}) {
  const routeChangePromiseRef = useRef<Promise<Array<PropsData> | null> | null>(
    null,
  );
  const [pathname, setPathname] = useState(window.location.pathname);

  const onRouteChange = async (match) => {
    setPathname(match.pathname);
    await routeChangePromiseRef.current;
  };

  return (
    <SSRPropsProvider pathname={pathname} promiseRef={routeChangePromiseRef}>
      <RouterHost onRouteChange={onRouteChange}>{children}</RouterHost>
    </SSRPropsProvider>
  );
}
```

---

## How It Works

### Build time

1. The plugin scans `basePath` for `.tsx` / `.jsx` files containing the `"use dynamic"` directive.
2. For each matched file it generates a Cloudflare Pages Function handler (an `onRequest` export) inside `actionBasePath`.
3. `frame-master-plugin-cloudflare-pages-functions-action` compiles those generated files into `./functions/` — the directory served by Cloudflare Pages.

### Request time

```
Browser request → Cloudflare Pages Function (generated handler)
  │
  ├─ Cache hit  → return cached HTML / props immediately
  │
  └─ Cache miss
       ├─ Call all loader_* callbacks server-side
       ├─ Render the default export React component to HTML
       ├─ Inject loader results as window.__PROVIDER_PROPS__ in <head>
       ├─ Store HTML + props in KV (or Cache API) with the configured TTL
       └─ Return the full HTML response
```

**Client-side navigation** (after the initial load): the client fetches only the props via a request with `Accept: application/vnd.ssr.props+json`. The full HTML is not re-rendered; `SSRPropsProvider` updates the React context with the new loader data.

---

## The `"use dynamic"` Directive

Add `"use dynamic"` as the first statement of any page file to mark it as a server-rendered dynamic page:

```typescript
"use dynamic";
// rest of the file...
```

A dynamic page file may export three things:

| Export                       | Required | Purpose                                                   |
| ---------------------------- | -------- | --------------------------------------------------------- |
| `export default`             | ✅       | The React component to render server-side                 |
| `export const loader_<name>` | ✗        | A data loader whose result is available via `useLoader()` |
| `export const ssr_configs`   | ✗        | Per-page cache configuration (TTL, etc.)                  |

---

## Complete Page Example

```typescript
// src/pages/dynamic/[id].tsx
"use dynamic";

import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";
import {
  createLoader,
  createPageConfig,
  type PluginEventContext,
} from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";

// Per-page cache configuration
export const ssr_configs = createPageConfig({
  callback(ctx) {
    return { ttl: 60 }; // cache for 60 seconds
  },
});

// Server-side data loader — reads the dynamic route parameter
export const loader_idData = createLoader({
  name: "idData",
  async callback(ctx: PluginEventContext<Env, "id", unknown>) {
    return { id: ctx.params.id };
  },
});

// Additional loader — fetch from an external API
export const loader_todo = createLoader({
  name: "todo",
  async callback() {
    return fetch("https://jsonplaceholder.typicode.com/todos/1").then((r) =>
      r.json()
    );
  },
});

export default function DynamicPage() {
  const idData = useLoader(loader_idData);
  const todo = useLoader(loader_todo);

  return (
    <div>
      <h1>Dynamic page — id: {idData?.id}</h1>
      <pre>{JSON.stringify(todo, null, 2)}</pre>
    </div>
  );
}
```

---

## API Reference

### `createLoader(props)`

Defines a server-side data loader for a dynamic page.

```typescript
import { createLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";

export const loader_myData = createLoader({
  name: "myData", // unique name within the page file
  async callback(ctx: PluginEventContext) {
    // runs server-side only
    return { value: 42 };
  },
});
```

| Parameter  | Type                                      | Description                                            |
| ---------- | ----------------------------------------- | ------------------------------------------------------ |
| `name`     | `string`                                  | Identifier used by `useLoader()` to look up the result |
| `callback` | `(ctx: PluginEventContext) => Promise<T>` | Async function that fetches/computes data              |

Returns a `LoaderManager<T>`. Pass the exported variable directly to `useLoader()`.

> The `callback` is **never shipped to the browser**. At build time the plugin replaces the full `createLoader(...)` expression in the client bundle with a lightweight metadata object `{ name, pathname }`.

---

### `createPageConfig(config)`

Configures caching behaviour for the page.

```typescript
import { createPageConfig } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";

export const ssr_configs = createPageConfig({
  callback(ctx) {
    return {
      ttl: 3600, // seconds to cache; default: 86400 (24 h)
    };
  },
});
```

| Parameter  | Type                                            | Description                                    |
| ---------- | ----------------------------------------------- | ---------------------------------------------- |
| `callback` | `(ctx: PluginEventContext) => { ttl?: number }` | Returns cache settings for the current request |

---

### `useLoader(loader)`

Reads the data produced by a loader inside a React component.

```typescript
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";

function MyComponent() {
  const data = useLoader(loader_myData); // T | null
}
```

- **During SSR**: reads the loader result from the request context.
- **On first client load**: reads from `window.__PROVIDER_PROPS__` injected into `<head>` by the server.
- **On client-side navigation**: `SSRPropsProvider` re-fetches props from the server and updates the context.
- Returns `null` until data is available.

---

### `useRequestContext()`

Returns the full Cloudflare `EventContext` enriched with plugin data. Usable inside loader callbacks and React components during SSR.

```typescript
import { useRequestContext } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";

function MyComponent() {
  const ctx = useRequestContext<Env, "id", unknown>();
  // ctx.params.id, ctx.env, ctx.request ...
}
```

---

### `PluginEventContext<Env, Params, Data>`

Type alias for Cloudflare's `EventContext` extended with plugin-specific data:

| Property                 | Type                     | Description                                     |
| ------------------------ | ------------------------ | ----------------------------------------------- |
| `ctx.params`             | `Record<Params, string>` | Dynamic route parameters (e.g. `{ id: "123" }`) |
| `ctx.env`                | `Env`                    | Cloudflare environment bindings                 |
| `ctx.request`            | `Request`                | The incoming HTTP request                       |
| `ctx.data.storeProvider` | `StoreProvider`          | The cache provider set up by the middleware     |
| `ctx.data.parser`        | `Parsers \| undefined`   | Optional JSX parser from the middleware         |

---

### `revalidate(pathname, ctx)`

Deletes the cached HTML and props for a given pathname, forcing the next request to re-render and re-cache the page.

```typescript
import { revalidate } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/revalidate";

// Inside a Cloudflare Pages action handler:
await revalidate("/dynamic/123", ctx);
```

Useful for on-demand cache invalidation after a database write or content update (ISR-style workflow).

---

### `createMiddleware(callback)`

Wraps all dynamic SSR route handlers with a Cloudflare Pages middleware. Must be exported as `onRequest` from your middleware file.

```ts
import createMiddleware from "frame-master-plugin-cloudflare-pages-dynamic-ssr/middleware";

export const onRequest = createMiddleware<Env>((ctx) => ({
  storeProvider: /* a store provider */,
  parser: { // optional
    jsx(pathname, pageElement) {
      return MyShell({ children: pageElement });
    },
  },
}));
```

The callback receives the `EventContext` and must return:

| Field           | Required | Type                                 | Description                                                                                 |
| --------------- | -------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `storeProvider` | ✅       | `StoreProvider`                      | Cache backend (KV or Cache API)                                                             |
| `parser.jsx`    | ✗        | `(pathname, element) => JSX.Element` | Wraps every rendered page before caching (see [Layout wrapping](#layout-wrapping-advanced)) |

---

## Store Providers

### KVProvider — Cloudflare KV (recommended)

Persistent key-value storage. Survives across deployments and worker restarts.

```ts
import KVProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/stores/cloudflareKV";

storeProvider: KVProvider({
  binding: ctx.env.MY_KV, // KVNamespace binding from wrangler.jsonc
  default_ttl: 86400, // optional global TTL in seconds (per-page ssr_configs TTL takes precedence)
});
```

Requires a `kv_namespaces` entry in `wrangler.jsonc`:

```jsonc
{
  "kv_namespaces": [{ "binding": "MY_KV", "id": "<namespace-id>" }],
}
```

---

### CacheProvider — Cloudflare Cache API

Uses Cloudflare's built-in edge cache. No KV binding required, but entries may be evicted at any time.

```typescript
import CacheProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/stores/cloudflareCache";

storeProvider: CacheProvider;
```

---

### Custom provider — `createStoreProvider`

Implement any storage backend (e.g. Cloudflare D1, R2, an external database) by passing low-level `get` / `set` / `delete` primitives.

```ts
import { createStoreProvider } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/utils";

export type Params = {
  endpoints: {
    get: string;
    set: string;
    delete: string;
  };
};

export function createCustomStore({ endpoints }: Params) {
  return createStoreProvider<{}>({
    ctx: {},
    async get(key, _) {
      const res = await fetch(endpoints.get + `?key=${key}`).then((r) =>
        r.json(),
      );
      return res?.value ?? null;
    },

    async set(key, value, _) {
      await fetch(
        endpoints.set + `?key=${key}&value=${encodeURI(JSON.stringify(value))}`,
        { method: "PUT" },
      );
    },

    async delete(key, _) {
      await fetch(endpoints.delete + `?key=${key}}`, { method: "DELETE" });
    },
  });
}
```

| Parameter | Type                                    | Description                                                               |
| --------- | --------------------------------------- | ------------------------------------------------------------------------- |
| `ctx`     | `Ctx`                                   | Arbitrary context object forwarded to every `get` / `set` / `delete` call |
| `get`     | `(key, ctx) => Promise<string \| null>` | Return the stored string for `key`, or `null` on a miss                   |
| `set`     | `(key, value, ctx) => Promise<void>`    | Persist `value` under `key`                                               |
| `delete`  | `(key, ctx) => Promise<void>`           | Remove `key` from the store                                               |

Returns a `StoreProvider` ready to pass to `createMiddleware`.

> The plugin stores two keys per page: `<pathname>` (full HTML) and `props::<pathname>` (loader data JSON). Both are written and deleted together.

---

## Plugin Options (`CloudflarePagesDynamicSSROptions`)

| Option              | Type                      | Required | Default       | Description                                                                                                       |
| ------------------- | ------------------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `actionBasePath`    | `string`                  | ✅       | —             | Directory where generated SSR action files are written (must match `CFActionPlugin.actionBasePath`)               |
| `basePath`          | `string`                  | ✗        | `"src/pages"` | Directory scanned for files with the `"use dynamic"` directive                                                    |
| `wrangler.port`     | `number \| string`        | ✅       | —             | Port of the Wrangler dev server                                                                                   |
| `entrypointMatcher` | `Array<RegExp \| string>` | ✗        | `[]`          | Additional file patterns collected as custom entrypoints (see [Custom Entrypoints](#custom-entrypoints-advanced)) |

---

## Layout Wrapping (advanced)

The `parser.jsx` option in `createMiddleware` lets you wrap every rendered page element before it is cached. Use this to apply a root HTML shell and Next.js-style nested layouts.

### File structure

```
src/pages/
  layout.tsx            <- root layout
  subroute/
    layout.tsx          <- nested layout
    index.tsx           <- "use dynamic" page
```

### `page-wrapper.tsx`

```tsx
import type { JSX } from "react";
import { NextJsStyleLayoutSetup } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/utils/index";
import Shell from "./shell";

export function PageWrapper({
  children,
  pathname,
}: {
  children: JSX.Element;
  pathname: string;
}) {
  return (
    <Shell>
      <script src="/@apply-react/client-hydrate.js" type="module" />
      {NextJsStyleLayoutSetup.PageWrapper({ children, pathname })}
    </Shell>
  );
}
```

### Middleware using `parser.jsx`

```typescript
import createMiddleware from "frame-master-plugin-cloudflare-pages-dynamic-ssr/middleware";
import KVProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/stores/cloudflareKV";
import { PageWrapper } from "./page-wrapper";

export const onRequest = createMiddleware<Env>((ctx) => ({
  storeProvider: KVProvider({ binding: ctx.env.DYNAMIC_PAGE_KV }),
  parser: {
    jsx(pathname, pageElement) {
      return PageWrapper({ children: pageElement, pathname });
    },
  },
}));
```

`NextJsStyleLayoutSetup.PageWrapper` walks up the path hierarchy, finds every `layout.tsx` ancestor, and wraps the page element from outermost to innermost — matching the behaviour of Next.js App Router layouts.

For `pathname = "/subroute/index"` the render tree becomes:

```
layout.tsx (root)
  └─ subroute/layout.tsx
       └─ page content
```

---

## Custom Entrypoints (advanced)

`entrypointMatcher` collects additional files (e.g. all layout files) into a virtual module importable anywhere during SSR:

```typescript
cloudflarePagesDynamicSSR({
  // ...
  entrypointMatcher: [/.*layout\.(jsx|tsx)$/],
});
```

```typescript
import CustomEntryPoints from "dynamic-ssr:entrypoints";
// type: Record<string, Record<string, unknown>>
// { "src/pages/layout.tsx": { default: LayoutComponent }, ... }
```

`NextJsStyleLayoutSetup` uses this internally to resolve layout components at render time.

---

## License

MIT
