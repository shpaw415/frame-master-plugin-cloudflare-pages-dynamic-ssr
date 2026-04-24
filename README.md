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
import buildUnifier from "frame-master-plugin-build-unifier";
import CFActionPlugin from "frame-master-plugin-cloudflare-pages-functions-action";

const config: FrameMasterConfig = {
  HTTPServer: { port: 3000 },
  plugins: [
    ...buildUnifier({
      plugins: [
        cloudflarepagesdynamicssr({
          publicPath: "/_dynamic",
          basePath: "src/pages"
        }),
        CFActionPlugin({
					actionBasePath: "src/actions",
					outDir: ".frame-master/build",
				})
      ]
    })
    
  ],
};

export default config;
```

## Features


## License

MIT
