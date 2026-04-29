import createMiddleware from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/endpoints/middleware.ts";
import KVProvider from "frame-master-plugin-cloudflare-pages-dynamic-ssr/provider/store/cloudflareKV.ts";
import { PageWrapper } from "../action-utils/page-wrapper";

export const onRequest = createMiddleware<Env>((ctx) => ({
	storeProvider: KVProvider(ctx.env.DYNAMIC_PAGE_KV),
	parser: {
		jsx(pathname, pageElement) {
			return PageWrapper({
				children: pageElement,
				pathname,
			});
		},
	},
}));
