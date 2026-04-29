import {
  require_jsx_dev_runtime
} from "./../chunk-trmgek8t.js";
import {
  __toESM
} from "./../chunk-ghta2cd7.js";

// src/pages/subroute/index.tsx
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
"use-dynamic";
async function Subroute() {
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("h1", {
        children: "Subroute"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("p", {
        children: "This page is rendered dynamically using the cloudflare-pages-dynamic-ssr plugin."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("p", {
        children: "Data fetched from an API test"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/actions/subroute/index.cfdynamicssr
"no-action";
var onRequest = async (ctx) => {
  const isScript = new URL(ctx.request.url).searchParams.get("dynamic-script"), pathname = new URL(ctx.request.url).pathname, header = new Headers;
  let type;
  if (isScript) {
    type = "javascript";
    header.set("content-type", "application/javascript; charset=utf-8");
  } else {
    header.set("content-type", "text/html; charset=utf-8");
    type = "html";
  }
  const storeProvider = ctx.data.storeProvider;
  let storedData = ctx.env.NODE_ENV === "development" ? null : await storeProvider.get(pathname);
  if (!storedData)
    storedData = await storeProvider.set({
      pathname,
      module: {
        default: Subroute
      },
      parser: ctx.data.parser
    });
  return new Response(type === "javascript" ? storedData.module : storedData.html, {
    status: 200,
    headers: header
  });
};
export {
  onRequest
};

//# debugId=9C7075A2112B06F964756E2164756E21
//# sourceMappingURL=./subroute/index.js.map
