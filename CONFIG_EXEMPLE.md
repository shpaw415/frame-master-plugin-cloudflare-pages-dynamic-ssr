
```jsonc
// wrangler.jsonc

{
    "kv_namespaces": [
		{
			"binding": "DYNAMIC_PAGE_KV",
			"id": "<your-KV-id>"
		}
	]
}

```

# Setup Cloudflare Pages Function Endpoint

```ts
// `<base_action_dir_path>/_dynamic_page/[id].ts` => e.g. `src/actions/_dynamic_page/[id].ts`
"no-action";
import { Endpoints } from "frame-master-plugin-cloudflare-pages-dynamic-ssr";

export const onRequest = Endpoints();

```