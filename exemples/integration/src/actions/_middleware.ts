import createMiddleware from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/endpoints/middleware.ts";
import KVProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/store/cloudflareKV.ts";

export const onRequest = createMiddleware<Env>((ctx) => ({
	storeProvider: KVProvider(ctx.env.DYNAMIC_PAGE_KV),
}));
