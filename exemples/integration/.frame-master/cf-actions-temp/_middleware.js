import {
  CtxContext,
  LoaderManager,
  require_jsx_dev_runtime
} from "./chunk-mwn6jbk9.js";
import {
  __export,
  __toESM
} from "./chunk-1t823wmt.js";

// node_modules/frame-master-plugin-cloudflare-pages-dynamic-ssr/src/provider/endpoints/middleware.ts
function createMiddleware(providerInit) {
  return async (context) => {
    context.data = await providerInit(context);
    return await context.next();
  };
}
var middleware_default = createMiddleware;

// node_modules/frame-master-plugin-cloudflare-pages-dynamic-ssr/src/server/wrapper.tsx
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
function Wrapper({
  children,
  ctx,
  propsData
}) {
  ctx.data.loader = {
    get(manager) {
      const prop = propsData.find((prop2) => prop2.name === manager.name && prop2.pathname === manager.pathname);
      if (!prop) {
        throw new Error(`Loader with name ${manager.name} not found for pathname ${manager.pathname}`);
      }
      return prop.data;
    }
  };
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV(CtxContext.Provider, {
    value: ctx,
    children
  }, undefined, false, undefined, this);
}

// node_modules/frame-master-plugin-cloudflare-pages-dynamic-ssr/src/provider/shared.ts
function toStore(data) {
  return JSON.stringify(data);
}
function fromStore(storeString) {
  return JSON.parse(storeString);
}
function createStoreProvider(params) {
  const _delete = async (pathname) => {
    await params.delete(pathname, params.ctx);
  };
  const _getStoreData = async (pathname) => {
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
  const _getStorePropsData = async (pathname) => {
    const storeString = await params.get(`props::${pathname}`, params.ctx);
    if (storeString === null)
      return null;
    const values = fromStore(storeString);
    return values;
  };
  const _setStorePropsData = async (pathname, value) => {
    await params.set(`props::${pathname}`, toStore(value), params.ctx);
  };
  const _set = async ({
    pathname,
    module,
    parser,
    ttl,
    ctx
  }) => {
    const page = module.default;
    const LoadersReturnValues = await Promise.all(Object.entries(module).filter(([, exp]) => exp instanceof LoaderManager).map(([name, loader]) => loader.props.callback(ctx).then((data) => ({ name, data, pathname }))));
    const pageElement = Wrapper({
      children: await page(),
      ctx,
      propsData: LoadersReturnValues
    });
    const { renderToString } = await import("./chunk-f1pqq6x5.js");
    const expiresAt = Date.now() + (ttl ?? 86400) * 1000;
    const dataToStore = {
      pathname,
      data: renderToString(parser?.jsx?.(pathname, pageElement) ?? pageElement),
      expiresAt
    };
    const propsDataToStore = {
      pathname,
      data: LoadersReturnValues,
      expiresAt
    };
    await Promise.all([
      params.set(pathname, toStore(dataToStore), params.ctx),
      _setStorePropsData(pathname, propsDataToStore)
    ]);
    return { html: dataToStore, props: propsDataToStore };
  };
  return {
    get: {
      page: _getStoreData,
      props: _getStorePropsData
    },
    set: _set,
    delete: _delete
  };
}

// node_modules/frame-master-plugin-cloudflare-pages-dynamic-ssr/src/provider/store/cloudflareKV.ts
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

// src/pages/layout.tsx
var exports_layout = {};
__export(exports_layout, {
  default: () => MainLayout
});
var jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
function MainLayout({
  children
}) {
  return /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("h1", {
        children: "Main Layout"
      }, undefined, false, undefined, this),
      children,
      /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("h1", {
        children: "Main Layout"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/pages/subroute/layout.tsx
var exports_layout2 = {};
__export(exports_layout2, {
  default: () => SubLayout
});
var jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
function SubLayout({ children }) {
  return /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("h1", {
        children: "Sub Layout"
      }, undefined, false, undefined, this),
      children,
      /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("h1", {
        children: "Sub Layout"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// @cf-dynamic-ssr/custom-entrypoints.cfdynamicentrypoints
var customEntrypoints = {
  "layout.tsx": exports_layout,
  "subroute/layout.tsx": exports_layout2
};
var custom_entrypoints_default = customEntrypoints;
// node_modules/frame-master-plugin-cloudflare-pages-dynamic-ssr/src/utils/index.ts
var NextJsStyleLayoutSetup = {
  regex: /^(.*)\/layout\.(js|ts|jsx|tsx)$/,
  getLayouts(pathname, layoutsPaths) {
    const segments = ["", ...pathname.split("/").filter(Boolean)];
    const possibleLayoutPaths = segments.reduce((acc, _, index) => {
      const layoutPath = `${segments.slice(0, index + 1).join("/")}/layout`;
      acc.push(`${layoutPath}.js`, `${layoutPath}.ts`, `${layoutPath}.jsx`, `${layoutPath}.tsx`);
      return acc;
    }, []);
    return possibleLayoutPaths.map((lp) => lp.slice(1)).filter((layoutPath) => layoutsPaths.includes(layoutPath));
  },
  stackLayouts(layouts, customEntryPoints, children) {
    return layouts.reduceRight((acc, layoutPath) => {
      const LayoutComponent = customEntryPoints[layoutPath]?.default;
      return LayoutComponent ? LayoutComponent({ children: acc }) : acc;
    }, children);
  },
  PageWrapper({
    children,
    pathname
  }) {
    const customEntryPointsPaths = Object.keys(custom_entrypoints_default);
    const layouts = this.getLayouts(pathname, customEntryPointsPaths);
    return this.stackLayouts(layouts, custom_entrypoints_default, children);
  }
};

// src/shell.tsx
var jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
function Shell({
  children
}) {
  return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("head", {
        children: [
          /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("meta", {
            charSet: "UTF-8"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("title", {
            children: "Dynamic SSR Shell"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("body", {
        id: "root",
        children
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/action-utils/page-wrapper.tsx
var jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
function PageWrapper({
  children,
  pathname
}) {
  return /* @__PURE__ */ jsx_dev_runtime5.jsxDEV(Shell, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime5.jsxDEV("script", {
        src: "/@apply-react/client-hydrate.js",
        type: "module"
      }, undefined, false, undefined, this),
      NextJsStyleLayoutSetup.PageWrapper({
        children,
        pathname
      })
    ]
  }, undefined, true, undefined, this);
}

// src/actions/_middleware.ts
var onRequest = middleware_default((ctx) => ({
  storeProvider: cloudflareKV_default(ctx.env.DYNAMIC_PAGE_KV),
  parser: {
    jsx(pathname, pageElement) {
      return PageWrapper({
        children: pageElement,
        pathname
      });
    }
  }
}));
export {
  onRequest
};

//# debugId=E4A76AC440796C1964756E2164756E21
//# sourceMappingURL=././_middleware.js.map
