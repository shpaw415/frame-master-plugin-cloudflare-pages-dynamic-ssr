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
