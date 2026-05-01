import {
  CtxContext,
  createLoader,
  require_jsx_dev_runtime
} from "./../chunk-33h8q4es.js";
import {
  __export,
  __toESM,
  require_react
} from "./../chunk-2sdwrsax.js";

// src/pages/subroute/index.tsx
var exports_subroute = {};
__export(exports_subroute, {
  loader_SubRouteServerData: () => loader_SubRouteServerData,
  default: () => Subroute
});

// ../../src/client/hooks.ts
var import_react = __toESM(require_react(), 1);
function useLoader(loader) {
  const ctx = import_react.useContext(CtxContext);
  if (typeof window === "undefined") {
    return ctx.data.loader.get(loader);
  }
  return loader;
}

// src/pages/subroute/index.tsx
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
"use-dynamic";
var loader_SubRouteServerData = createLoader({
  callback: async () => {
    return await fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) => res.json());
  }
});
function Subroute() {
  const data = useLoader(loader_SubRouteServerData);
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
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("pre", {
        children: JSON.stringify(data, null, 2)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/actions/subroute/index.cfdynamicssr
"no-action";
var onRequest = async (ctx) => {
  const acceptedTypes = ctx.request.headers.get("accept")?.includes("application/vnd.ssr.props+json") ? "props" : "html", pathname = new URL(ctx.request.url).pathname, header = new Headers;
  if (acceptedTypes === "props") {
    header.set("content-type", "application/vnd.ssr.props+json; charset=utf-8");
    const propsData = null;
    if (propsData)
      return Response.json(propsData);
    const { props } = await ctx.data.storeProvider.set({
      pathname,
      module: exports_subroute,
      parser: ctx.data.parser,
      ctx
    });
    return Response.json(props);
  } else
    header.set("content-type", "text/html; charset=utf-8");
  const storeProvider = ctx.data.storeProvider;
  let storedData = ctx.env.NODE_ENV === "development" ? null : await storeProvider.get.page(pathname);
  if (!storedData)
    storedData = await storeProvider.set({
      pathname,
      module: {
        default: Subroute
      },
      parser: ctx.data.parser,
      ctx
    }).then(({ html }) => html);
  return new Response(storedData?.data, {
    status: 200,
    headers: header
  });
};
export {
  onRequest
};

//# debugId=84D58418A3F58B5764756E2164756E21
//# sourceMappingURL=./subroute/index.js.map
