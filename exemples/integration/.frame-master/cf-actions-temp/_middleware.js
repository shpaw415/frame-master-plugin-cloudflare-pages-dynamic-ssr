import {
  require_jsx_dev_runtime
} from "./chunk-trmgek8t.js";
import {
  __export,
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
    presets: [["react"]],
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
  const _set = async ({
    pathname,
    module,
    parser,
    ttl
  }) => {
    const page = module.default;
    const pageElement = await page();
    const toJSXString = (await import("./chunk-hz3mt98b.js").then((m)=>__toESM(m.default,1))).default.default;
    const jsxString = toJSXString(pageElement, {
      showFunctions: true
    });
    const moduleString = `
		
		${await transpileModuleToJavaScript(`export default function DynamicPage() { return (${jsxString}); }`)}
		`;
    const { renderToString } = await import("./chunk-3wqc0krq.js");
    const dataToStore = {
      pathname,
      module: parser?.module?.(pathname, moduleString, module) ?? moduleString,
      html: renderToString(parser?.jsx?.(pathname, pageElement) ?? pageElement),
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

// src/pages/layout.tsx
var exports_layout = {};
__export(exports_layout, {
  default: () => MainLayout
});
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
function MainLayout({
  children
}) {
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("h1", {
        children: "Main Layout"
      }, undefined, false, undefined, this),
      children,
      /* @__PURE__ */ jsx_dev_runtime.jsxDEV("h1", {
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
var jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
function SubLayout({ children }) {
  return /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("div", {
    children: [
      /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("h1", {
        children: "Sub Layout"
      }, undefined, false, undefined, this),
      children,
      /* @__PURE__ */ jsx_dev_runtime2.jsxDEV("h1", {
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
// ../../src/utils/index.ts
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
var jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
function Shell({
  children
}) {
  return /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("head", {
        children: [
          /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("meta", {
            charSet: "UTF-8"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("title", {
            children: "Dynamic SSR Shell"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsx_dev_runtime3.jsxDEV("body", {
        id: "root",
        children
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// src/action-utils/page-wrapper.tsx
var jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
function PageWrapper({
  children,
  pathname
}) {
  return /* @__PURE__ */ jsx_dev_runtime4.jsxDEV(Shell, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime4.jsxDEV("script", {
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

//# debugId=BB64E8C5080DC55764756E2164756E21
//# sourceMappingURL=././_middleware.js.map
