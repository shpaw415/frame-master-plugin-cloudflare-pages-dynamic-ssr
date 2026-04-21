# Custom hydration adapter example

This example shows how to replace the plugin's default hydration runtime with your own reusable server and client adapters.

Use these modules in the plugin config:

```ts
import cloudflarepagesdynamicssr from "cloudflare-pages-dynamic-ssr";

cloudflarepagesdynamicssr({
	hydration: {
		serverAdapterModule: "./docs/examples/custom-hydration/server-adapter.ts",
		clientAdapterModule: "./docs/examples/custom-hydration/client-adapter.ts",
	},
});
```

The server adapter controls the HTML wrapper and injected script tags.
The client adapter controls how the browser turns the SSR markup into a live React tree.