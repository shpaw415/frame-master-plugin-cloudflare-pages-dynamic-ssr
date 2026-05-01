import {
  CtxContext,
  LoaderManager,
  require_jsx_dev_runtime
} from "./chunk-33h8q4es.js";
import {
  __commonJS,
  __export,
  __toESM,
  require_react
} from "./chunk-2sdwrsax.js";

// ../../node_modules/react/cjs/react-jsx-dev-runtime.development.js
var require_react_jsx_dev_runtime_development = __commonJS((exports) => {
  var React = __toESM(require_react());
  (function() {
    function getComponentNameFromType(type) {
      if (type == null)
        return null;
      if (typeof type === "function")
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if (typeof type === "string")
        return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if (typeof type === "object")
        switch (typeof type.tag === "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {}
        }
      return null;
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function checkKeyStringCoercion(value) {
      try {
        testStringCoercion(value);
        var JSCompiler_inline_result = false;
      } catch (e) {
        JSCompiler_inline_result = true;
      }
      if (JSCompiler_inline_result) {
        JSCompiler_inline_result = console;
        var JSCompiler_temp_const = JSCompiler_inline_result.error;
        var JSCompiler_inline_result$jscomp$0 = typeof Symbol === "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
        JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
        return testStringCoercion(value);
      }
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE)
        return "<>";
      if (typeof type === "object" && type !== null && type.$$typeof === REACT_LAZY_TYPE)
        return "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function getOwner() {
      var dispatcher = ReactSharedInternals.A;
      return dispatcher === null ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
      return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
      if (hasOwnProperty.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning)
          return false;
      }
      return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      function warnAboutAccessingKey() {
        specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
      }
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, "key", {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function elementRefGetterWithDeprecationWarning() {
      var componentName = getComponentNameFromType(this.type);
      didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
      componentName = this.props.ref;
      return componentName !== undefined ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
      var refProp = props.ref;
      type = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };
      (refProp !== undefined ? refProp : null) !== null ? Object.defineProperty(type, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning
      }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
      type._store = {};
      Object.defineProperty(type._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(type, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });
      Object.defineProperty(type, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack
      });
      Object.defineProperty(type, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask
      });
      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
      return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
      var children = config.children;
      if (children !== undefined)
        if (isStaticChildren)
          if (isArrayImpl(children)) {
            for (isStaticChildren = 0;isStaticChildren < children.length; isStaticChildren++)
              validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
          } else
            console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else
          validateChildKeys(children);
      if (hasOwnProperty.call(config, "key")) {
        children = getComponentNameFromType(type);
        var keys = Object.keys(config).filter(function(k) {
          return k !== "key";
        });
        isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
        didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = true);
      }
      children = null;
      maybeKey !== undefined && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
      hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          propName !== "key" && (maybeKey[propName] = config[propName]);
      } else
        maybeKey = config;
      children && defineKeyPropWarningGetter(maybeKey, typeof type === "function" ? type.displayName || type.name || "Unknown" : type);
      return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
      isValidElement(node) ? node._store && (node._store.validated = 1) : typeof node === "object" && node !== null && node.$$typeof === REACT_LAZY_TYPE && (node._payload.status === "fulfilled" ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
      return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
      return null;
    };
    React = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
      var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
  })();
});

// ../../node_modules/react/jsx-dev-runtime.js
var require_jsx_dev_runtime2 = __commonJS((exports, module) => {
  var react_jsx_dev_runtime_development = __toESM(require_react_jsx_dev_runtime_development());
  if (false) {} else {
    module.exports = react_jsx_dev_runtime_development;
  }
});

// ../../src/provider/endpoints/middleware.ts
function createMiddleware(providerInit) {
  return async (context) => {
    context.data = await providerInit(context);
    return await context.next();
  };
}
var middleware_default = createMiddleware;

// ../../src/server/wrapper.tsx
var jsx_dev_runtime = __toESM(require_jsx_dev_runtime2(), 1);
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

// ../../src/provider/shared.ts
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
    const { renderToString } = await import("./chunk-z6pec7pq.js");
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

//# debugId=A8041BA34D19B8CE64756E2164756E21
//# sourceMappingURL=././_middleware.js.map
