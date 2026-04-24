import {
  __require,
  __toESM
} from "./chunk-ghta2cd7.js";

// ../../src/provider/endpoints/middleware.ts
function createMiddleware(providerInit) {
  return async (context) => {
    context.data = await providerInit(context);
    return await context.next();
  };
}
var middleware_default = createMiddleware;

// ../../src/provider/shared.ts
function toStore({ pathname, module, html }) {
  const store = {
    pathname,
    module: btoa(module),
    html: btoa(html)
  };
  return JSON.stringify(store);
}
function fromStore(storeString) {
  const store = JSON.parse(storeString);
  return {
    pathname: store.pathname,
    module: atob(store.module),
    html: atob(store.html)
  };
}
async function transpileModuleToJavaScript(moduleSource) {
  const { transform } = await import("./chunk-x5eqa115.js").then((m)=>__toESM(m.default,1));
  const result = transform(moduleSource, {
    presets: [["react", { runtime: "automatic" }]],
    sourceType: "module",
    comments: false,
    compact: true
  });
  if (!result?.code) {
    throw new Error("Failed to transpile the dynamic page module");
  }
  return result.code;
}
function createStoreProvider(params) {
  const _delete = async (pathname) => {
    await params.delete(pathname, params.ctx);
  };
  const _get = async (pathname) => {
    const storeString = await params.get(pathname, params.ctx);
    if (storeString === null) {
      return null;
    }
    const values = fromStore(storeString);
    if (values.expiresAt && values.expiresAt < Date.now()) {
      await _delete(pathname);
      return null;
    }
    return values;
  };
  const _set = async (pathname, module, ttl) => {
    const { renderToReadableStream } = await import("./chunk-qdvbdg85.js");
    const createElement = (await import("./chunk-kp0478fv.js")).default.createElement;
    const page = module.default;
    console.log(createElement);
    const stream = await renderToReadableStream(createElement(page));
    await stream.allReady;
    const html = await new Response(stream).text();
    const moduleString = await transpileModuleToJavaScript(`export default function DynamicPage() { return (${html}); }`);
    const dataToStore = {
      pathname,
      module: moduleString,
      html,
      expiresAt: Date.now() + (ttl ?? 86400) * 1000
    };
    await params.set(pathname, toStore(dataToStore), params.ctx);
    return dataToStore;
  };
  return {
    get: _get,
    set: _set,
    delete: _delete
  };
}

// ../../src/provider/store/cloudflareKV.ts
var cloudflareKV_default = (kv) => createStoreProvider({
  get: async (id, ctx) => {
    const value = await ctx.kv.get(id);
    return value;
  },
  set: async (id, value, ctx) => {
    await ctx.kv.put(id, value);
  },
  delete: async (id, ctx) => {
    await ctx.kv.delete(id);
  },
  ctx: { kv }
});

// src/actions/_middleware.ts
var onRequest = middleware_default((ctx) => ({
  storeProvider: cloudflareKV_default(ctx.env.DYNAMIC_PAGE_KV)
}));
export {
  onRequest
};
