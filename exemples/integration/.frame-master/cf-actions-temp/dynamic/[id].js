import {
  useLoader
} from "./../chunk-7xgx53a5.js";
import {
  createLoader,
  require_jsx_dev_runtime
} from "./../chunk-33h8q4es.js";
import {
  __export,
  __toESM
} from "./../chunk-2sdwrsax.js";

// src/pages/dynamic/[id].tsx
var exports__id_ = {};
__export(exports__id_, {
  loader_idData: () => loader_idData,
  default: () => Dynamic
});
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
"use dynamic";
var loader_idData = createLoader({
  async callback(ctx) {
    return {
      id: ctx.params.id
    };
  }
});
function Dynamic() {
  const data = useLoader(loader_idData);
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("h1", {
        children: "Dynamic page"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("p", {
        children: [
          "This page is rendered dynamically using the cloudflare-pages-dynamic-ssr plugin. ",
          JSON.stringify(data, null, 2)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/actions/dynamic/[id].cfdynamicssr
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
      module: exports__id_,
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
        default: Dynamic
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

//# debugId=53C807E480328B3B64756E2164756E21
//# sourceMappingURL=./dynamic/[id].js.map
