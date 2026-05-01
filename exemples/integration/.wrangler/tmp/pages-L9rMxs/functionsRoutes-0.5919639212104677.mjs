import { onRequest as __dynamic__id__js_onRequest } from "/home/shpaw415/frame-master-plugin/cloudflare-pages-dynamic-ssr/exemples/integration/functions/dynamic/[id].js"
import { onRequest as __subroute_index_js_onRequest } from "/home/shpaw415/frame-master-plugin/cloudflare-pages-dynamic-ssr/exemples/integration/functions/subroute/index.js"
import { onRequest as ___middleware_js_onRequest } from "/home/shpaw415/frame-master-plugin/cloudflare-pages-dynamic-ssr/exemples/integration/functions/_middleware.js"

export const routes = [
    {
      routePath: "/dynamic/:id",
      mountPath: "/dynamic",
      method: "",
      middlewares: [],
      modules: [__dynamic__id__js_onRequest],
    },
  {
      routePath: "/subroute",
      mountPath: "/subroute",
      method: "",
      middlewares: [],
      modules: [__subroute_index_js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]