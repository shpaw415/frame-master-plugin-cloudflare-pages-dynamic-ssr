
								"no-action";
								import * as PageModule from "/home/shpaw415/frame-master-plugins/cloudflare-pages-dynamic-ssr/exemples/integration/src/pages/subroute/index.tsx";
								export const onRequest = async (ctx) => {
            const accept = ctx.request.headers.get("accept") || "", pathname = new URL(ctx.request.url).pathname, header = new Headers;
            let type;
            if (accept.includes("application/javascript")) {
              type = "javascript";
              header.set("content-type", "application/javascript; charset=utf-8");
            } else {
              header.set("content-type", "text/html; charset=utf-8");
              type = "html";
            }
            const storeProvider = ctx.data.storeProvider, HTMLParser = ctx.data.parser?.html ?? ((html) => `<html><head></head><body>${html}</body></html>`), ModuleParser = ctx.data.parser?.module ?? ((moduleString) => moduleString);
            let storedData = await storeProvider.get(pathname);
            if (!storedData)
              storedData = await storeProvider.set(pathname, {
                default: PageModule.default
              });
            return new Response(type === "javascript" ? ModuleParser(storedData.module, PageModule) : HTMLParser(storedData.html), {
              status: 200,
              headers: header
            });
          };
										