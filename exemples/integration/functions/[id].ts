import Page from "../src/pages/[id].tsx";
import { renderDynamicPage } from "../.frame-master/generated/cloudflare-pages-dynamic-ssr/runtime/server.ts";
import hydrationServerAdapter from "../.frame-master/generated/cloudflare-pages-dynamic-ssr/runtime/default-server-adapter.ts";
export const onRequest = (context: { request: Request; params?: Record<string, unknown> }) => {
  return renderDynamicPage({
    context,
    routePath: "/[id]",
    clientScriptPath: "/_dynamic/[id].js",
    mountSelector: "#app",
    payloadElementId: "__FM_DYNAMIC_PAYLOAD__",
    Page,
    hydrationServerAdapter,
  });
};
