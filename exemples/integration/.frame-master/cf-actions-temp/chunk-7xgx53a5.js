import {
  CtxContext
} from "./chunk-33h8q4es.js";
import {
  __toESM,
  require_react
} from "./chunk-2sdwrsax.js";

// ../../src/client/hooks.ts
var import_react = __toESM(require_react(), 1);
function useLoader(loader) {
  const ctx = import_react.useContext(CtxContext);
  if (typeof window === "undefined") {
    return ctx?.data?.loader?.get(loader);
  }
  return loader;
}

export { useLoader };

//# debugId=86149928816FD90364756E2164756E21
//# sourceMappingURL=./chunk-7xgx53a5.js.map
