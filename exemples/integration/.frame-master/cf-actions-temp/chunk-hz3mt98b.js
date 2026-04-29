import {
  require_react
} from "./chunk-drwsr477.js";
import {
  __commonJS,
  __toESM
} from "./chunk-ghta2cd7.js";

// ../../node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS((exports) => {
  (function() {
    function typeOf(object) {
      if (typeof object === "object" && object !== null) {
        var $$typeof = object.$$typeof;
        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            switch (object = object.type, object) {
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
              case REACT_SUSPENSE_LIST_TYPE:
              case REACT_VIEW_TRANSITION_TYPE:
                return object;
              default:
                switch (object = object && object.$$typeof, object) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                    return object;
                  case REACT_CONSUMER_TYPE:
                    return object;
                  default:
                    return $$typeof;
                }
            }
          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
    exports.ContextConsumer = REACT_CONSUMER_TYPE;
    exports.ContextProvider = REACT_CONTEXT_TYPE;
    exports.Element = REACT_ELEMENT_TYPE;
    exports.ForwardRef = REACT_FORWARD_REF_TYPE;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Lazy = REACT_LAZY_TYPE;
    exports.Memo = REACT_MEMO_TYPE;
    exports.Portal = REACT_PORTAL_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
    exports.isContextConsumer = function(object) {
      return typeOf(object) === REACT_CONSUMER_TYPE;
    };
    exports.isContextProvider = function(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    };
    exports.isElement = function(object) {
      return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    };
    exports.isForwardRef = function(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    };
    exports.isFragment = function(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    };
    exports.isLazy = function(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    };
    exports.isMemo = function(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    };
    exports.isPortal = function(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    };
    exports.isProfiler = function(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    };
    exports.isStrictMode = function(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    };
    exports.isSuspense = function(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    };
    exports.isSuspenseList = function(object) {
      return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
    };
    exports.isValidElementType = function(type) {
      return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || type.getModuleId !== undefined) ? true : false;
    };
    exports.typeOf = typeOf;
  })();
});

// ../../node_modules/react-is/index.js
var require_react_is = __commonJS((exports, module) => {
  var react_is_development = __toESM(require_react_is_development());
  if (false) {} else {
    module.exports = react_is_development;
  }
});

// ../../node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject(o) {
    var ctor, prot;
    if (isObject(o) === false)
      return false;
    ctor = o.constructor;
    if (ctor === undefined)
      return true;
    prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  exports.isPlainObject = isPlainObject;
});

// ../../node_modules/@base2/pretty-print-object/dist/index.js
var require_dist = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar;i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.prettyPrint = undefined;
  var seen = [];
  function isObj(value) {
    var type = typeof value;
    return value !== null && (type === "object" || type === "function");
  }
  function isRegexp(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
  }
  function getOwnEnumPropSymbols(object) {
    return Object.getOwnPropertySymbols(object).filter(function(keySymbol) {
      return Object.prototype.propertyIsEnumerable.call(object, keySymbol);
    });
  }
  function prettyPrint(input, options, pad) {
    if (pad === undefined) {
      pad = "";
    }
    var defaultOptions = {
      indent: "\t",
      singleQuotes: true
    };
    var combinedOptions = __assign(__assign({}, defaultOptions), options);
    var tokens;
    if (combinedOptions.inlineCharacterLimit === undefined) {
      tokens = {
        newLine: `
`,
        newLineOrSpace: `
`,
        pad,
        indent: pad + combinedOptions.indent
      };
    } else {
      tokens = {
        newLine: "@@__PRETTY_PRINT_NEW_LINE__@@",
        newLineOrSpace: "@@__PRETTY_PRINT_NEW_LINE_OR_SPACE__@@",
        pad: "@@__PRETTY_PRINT_PAD__@@",
        indent: "@@__PRETTY_PRINT_INDENT__@@"
      };
    }
    var expandWhiteSpace = function(string) {
      if (combinedOptions.inlineCharacterLimit === undefined) {
        return string;
      }
      var oneLined = string.replace(new RegExp(tokens.newLine, "g"), "").replace(new RegExp(tokens.newLineOrSpace, "g"), " ").replace(new RegExp(tokens.pad + "|" + tokens.indent, "g"), "");
      if (oneLined.length <= combinedOptions.inlineCharacterLimit) {
        return oneLined;
      }
      return string.replace(new RegExp(tokens.newLine + "|" + tokens.newLineOrSpace, "g"), `
`).replace(new RegExp(tokens.pad, "g"), pad).replace(new RegExp(tokens.indent, "g"), pad + combinedOptions.indent);
    };
    if (seen.indexOf(input) !== -1) {
      return '"[Circular]"';
    }
    if (input === null || input === undefined || typeof input === "number" || typeof input === "boolean" || typeof input === "function" || typeof input === "symbol" || isRegexp(input)) {
      return String(input);
    }
    if (input instanceof Date) {
      return "new Date('".concat(input.toISOString(), "')");
    }
    if (Array.isArray(input)) {
      if (input.length === 0) {
        return "[]";
      }
      seen.push(input);
      var ret = "[" + tokens.newLine + input.map(function(el, i) {
        var eol = input.length - 1 === i ? tokens.newLine : "," + tokens.newLineOrSpace;
        var value = prettyPrint(el, combinedOptions, pad + combinedOptions.indent);
        if (combinedOptions.transform) {
          value = combinedOptions.transform(input, i, value);
        }
        return tokens.indent + value + eol;
      }).join("") + tokens.pad + "]";
      seen.pop();
      return expandWhiteSpace(ret);
    }
    if (isObj(input)) {
      var objKeys_1 = __spreadArray(__spreadArray([], Object.keys(input), true), getOwnEnumPropSymbols(input), true);
      if (combinedOptions.filter) {
        objKeys_1 = objKeys_1.filter(function(el) {
          return combinedOptions.filter && combinedOptions.filter(input, el);
        });
      }
      if (objKeys_1.length === 0) {
        return "{}";
      }
      seen.push(input);
      var ret = "{" + tokens.newLine + objKeys_1.map(function(el, i) {
        var eol = objKeys_1.length - 1 === i ? tokens.newLine : "," + tokens.newLineOrSpace;
        var isSymbol = typeof el === "symbol";
        var isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el.toString());
        var key = isSymbol || isClassic ? el : prettyPrint(el, combinedOptions);
        var value = prettyPrint(input[el], combinedOptions, pad + combinedOptions.indent);
        if (combinedOptions.transform) {
          value = combinedOptions.transform(input, el, value);
        }
        return tokens.indent + String(key) + ": " + value + eol;
      }).join("") + tokens.pad + "}";
      seen.pop();
      return expandWhiteSpace(ret);
    }
    input = String(input).replace(/[\r\n]/g, function(x) {
      return x === `
` ? "\\n" : "\\r";
    });
    if (!combinedOptions.singleQuotes) {
      input = input.replace(/"/g, "\\\"");
      return '"'.concat(input, '"');
    }
    input = input.replace(/\\?'/g, "\\'");
    return "'".concat(input, "'");
  }
  exports.prettyPrint = prettyPrint;
});

// ../../node_modules/react-element-to-jsx-string/dist/cjs/index.js
var require_cjs = __commonJS((exports) => {
  var React = __toESM(require_react());
  var reactIs = __toESM(require_react_is());
  Object.defineProperty(exports, "__esModule", { value: true });
  var isPlainObject = require_is_plain_object();
  var prettyPrintObject = require_dist();
  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
  }
  function _interopNamespace(e) {
    if (e && e.__esModule)
      return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function(k) {
        if (k !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k];
            }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }
  var React__namespace = /* @__PURE__ */ _interopNamespace(React);
  var React__default = /* @__PURE__ */ _interopDefaultLegacy(React);
  var spacer = function(times, tabStop) {
    if (times === 0) {
      return "";
    }
    return new Array(times * tabStop).fill(" ").join("");
  };
  function _arrayLikeToArray(r, a) {
    (a == null || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a);e < a; e++)
      n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r))
      return _arrayLikeToArray(r);
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArray(r) {
    if (typeof Symbol != "undefined" && r[Symbol.iterator] != null || r["@@iterator"] != null)
      return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1;r < arguments.length; r++) {
      var t = arguments[r] != null ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if (typeof t != "object" || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== undefined) {
      var i = e.call(t, r || "default");
      if (typeof i != "object")
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return typeof i == "symbol" ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && typeof Symbol == "function" && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if (typeof r == "string")
        return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return t === "Object" && r.constructor && (t = r.constructor.name), t === "Map" || t === "Set" ? Array.from(r) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : undefined;
    }
  }
  function safeSortObject(value, seen) {
    if (value === null || _typeof(value) !== "object") {
      return value;
    }
    if (value instanceof Date || value instanceof RegExp) {
      return value;
    }
    if (/* @__PURE__ */ React__namespace.isValidElement(value)) {
      var copyObj = _objectSpread2({}, value);
      delete copyObj._owner;
      return copyObj;
    }
    seen.add(value);
    if (Array.isArray(value)) {
      return value.map(function(v) {
        return safeSortObject(v, seen);
      });
    }
    return Object.keys(value).sort().reduce(function(result, key) {
      if (key === "current" || seen.has(value[key])) {
        result[key] = "[Circular]";
      } else {
        result[key] = safeSortObject(value[key], seen);
      }
      return result;
    }, {});
  }
  function sortObject(value) {
    return safeSortObject(value, new WeakSet);
  }
  var createStringTreeNode = function createStringTreeNode2(value) {
    return {
      type: "string",
      value
    };
  };
  var createNumberTreeNode = function createNumberTreeNode2(value) {
    return {
      type: "number",
      value
    };
  };
  var createReactElementTreeNode = function createReactElementTreeNode2(displayName, props, defaultProps, childrens) {
    return {
      type: "ReactElement",
      displayName,
      props,
      defaultProps,
      childrens
    };
  };
  var createReactFragmentTreeNode = function createReactFragmentTreeNode2(key, childrens) {
    return {
      type: "ReactFragment",
      key,
      childrens
    };
  };
  var supportFragment = Boolean(React.Fragment);
  var getFunctionTypeName = function getFunctionTypeName2(functionType) {
    if (!functionType.name || functionType.name === "_default") {
      return "No Display Name";
    }
    return functionType.name;
  };
  var _getWrappedComponentDisplayName = function getWrappedComponentDisplayName(Component) {
    switch (true) {
      case Boolean(Component.displayName):
        return Component.displayName;
      case Component.$$typeof === reactIs.Memo:
        return _getWrappedComponentDisplayName(Component.type);
      case Component.$$typeof === reactIs.ForwardRef:
        return _getWrappedComponentDisplayName(Component.render);
      default:
        return getFunctionTypeName(Component);
    }
  };
  var getReactElementDisplayName = function getReactElementDisplayName2(element) {
    switch (true) {
      case typeof element.type === "string":
        return element.type;
      case typeof element.type === "function":
        if (element.type.displayName) {
          return element.type.displayName;
        }
        return getFunctionTypeName(element.type);
      case reactIs.isForwardRef(element):
      case reactIs.isMemo(element):
        return _getWrappedComponentDisplayName(element.type);
      case reactIs.isContextConsumer(element):
        return "".concat(element.type._context.displayName || "Context", ".Consumer");
      case reactIs.isContextProvider(element):
        return "".concat(element.type.displayName || "Context", ".Provider");
      case reactIs.isLazy(element):
        return "Lazy";
      case reactIs.isProfiler(element):
        return "Profiler";
      case reactIs.isStrictMode(element):
        return "StrictMode";
      case reactIs.isSuspense(element):
        return "Suspense";
      default:
        return "UnknownElementType";
    }
  };
  var noChildren = function noChildren2(propsValue, propName) {
    return propName !== "children";
  };
  var onlyMeaningfulChildren = function onlyMeaningfulChildren2(children) {
    return children !== true && children !== false && children !== null && children !== "";
  };
  var filterProps = function filterProps2(originalProps, cb) {
    var filteredProps = {};
    Object.keys(originalProps).filter(function(key) {
      return cb(originalProps[key], key);
    }).forEach(function(key) {
      return filteredProps[key] = originalProps[key];
    });
    return filteredProps;
  };
  var _parseReactElement = function parseReactElement(element, options) {
    var _options$displayName = options.displayName, displayNameFn = _options$displayName === undefined ? getReactElementDisplayName : _options$displayName;
    if (typeof element === "string") {
      return createStringTreeNode(element);
    } else if (typeof element === "number") {
      return createNumberTreeNode(element);
    } else if (!/* @__PURE__ */ React__default["default"].isValidElement(element)) {
      throw new Error("react-element-to-jsx-string: Expected a React.Element, got `".concat(_typeof(element), "`"));
    }
    var displayName = displayNameFn(element);
    var props = filterProps(element.props, noChildren);
    var key = element.key;
    if (typeof key === "string" && key.search(/^\./)) {
      props.key = key;
    }
    var defaultProps = filterProps(element.type.defaultProps || {}, noChildren);
    var childrens = React__default["default"].Children.toArray(element.props.children).filter(onlyMeaningfulChildren).map(function(child) {
      return _parseReactElement(child, options);
    });
    if (supportFragment && element.type === React.Fragment) {
      return createReactFragmentTreeNode(key, childrens);
    }
    return createReactElementTreeNode(displayName, props, defaultProps, childrens);
  };
  function noRefCheck() {}
  var inlineFunction = function inlineFunction2(fn) {
    return fn.toString().split(`
`).map(function(line) {
      return line.trim();
    }).join("");
  };
  var preserveFunctionLineBreak = function preserveFunctionLineBreak2(fn) {
    return fn.toString();
  };
  var defaultFunctionValue = inlineFunction;
  var formatFunction = function(fn, options) {
    var _options$functionValu = options.functionValue, functionValue = _options$functionValu === undefined ? defaultFunctionValue : _options$functionValu, showFunctions = options.showFunctions;
    if (!showFunctions && functionValue === defaultFunctionValue) {
      return functionValue(noRefCheck);
    }
    return functionValue(fn);
  };
  var formatComplexDataStructure = function(value, inline, lvl, options) {
    var normalizedValue = sortObject(value);
    var stringifiedValue = prettyPrintObject.prettyPrint(normalizedValue, {
      transform: function transform(currentObj, prop, originalResult) {
        var currentValue = currentObj[prop];
        if (currentValue && /* @__PURE__ */ React.isValidElement(currentValue)) {
          return formatTreeNode(_parseReactElement(currentValue, options), true, lvl, options);
        }
        if (typeof currentValue === "function") {
          return formatFunction(currentValue, options);
        }
        return originalResult;
      }
    });
    if (inline) {
      return stringifiedValue.replace(/\s+/g, " ").replace(/{ /g, "{").replace(/ }/g, "}").replace(/\[ /g, "[").replace(/ ]/g, "]");
    }
    return stringifiedValue.replace(/\t/g, spacer(1, options.tabStop)).replace(/\n([^$])/g, `
`.concat(spacer(lvl + 1, options.tabStop), "$1"));
  };
  var escape$1 = function escape2(s) {
    return s.replace(/"/g, "&quot;");
  };
  var formatPropValue = function formatPropValue2(propValue, inline, lvl, options) {
    if (typeof propValue === "number") {
      return "{".concat(String(propValue), "}");
    }
    if (typeof propValue === "string") {
      return '"'.concat(escape$1(propValue), '"');
    }
    if (_typeof(propValue) === "symbol") {
      var symbolDescription = propValue.valueOf().toString().replace(/Symbol\((.*)\)/, "$1");
      if (!symbolDescription) {
        return "{Symbol()}";
      }
      return "{Symbol('".concat(symbolDescription, "')}");
    }
    if (typeof propValue === "function") {
      return "{".concat(formatFunction(propValue, options), "}");
    }
    if (/* @__PURE__ */ React.isValidElement(propValue)) {
      return "{".concat(formatTreeNode(_parseReactElement(propValue, options), true, lvl, options), "}");
    }
    if (propValue instanceof Date) {
      if (isNaN(propValue.valueOf())) {
        return "{new Date(NaN)}";
      }
      return '{new Date("'.concat(propValue.toISOString(), '")}');
    }
    if (isPlainObject.isPlainObject(propValue) || Array.isArray(propValue)) {
      return "{".concat(formatComplexDataStructure(propValue, inline, lvl, options), "}");
    }
    return "{".concat(String(propValue), "}");
  };
  var formatProp = function(name, hasValue, value, hasDefaultValue, defaultValue, inline, lvl, options) {
    if (!hasValue && !hasDefaultValue) {
      throw new Error('The prop "'.concat(name, '" has no value and no default: could not be formatted'));
    }
    var usedValue = hasValue ? value : defaultValue;
    var { useBooleanShorthandSyntax, tabStop } = options;
    var formattedPropValue = formatPropValue(usedValue, inline, lvl, options);
    var attributeFormattedInline = " ";
    var attributeFormattedMultiline = `
`.concat(spacer(lvl + 1, tabStop));
    var isMultilineAttribute = formattedPropValue.includes(`
`);
    if (useBooleanShorthandSyntax && formattedPropValue === "{false}" && !hasDefaultValue) {
      attributeFormattedInline = "";
      attributeFormattedMultiline = "";
    } else if (useBooleanShorthandSyntax && formattedPropValue === "{true}") {
      attributeFormattedInline += "".concat(name);
      attributeFormattedMultiline += "".concat(name);
    } else {
      attributeFormattedInline += "".concat(name, "=").concat(formattedPropValue);
      attributeFormattedMultiline += "".concat(name, "=").concat(formattedPropValue);
    }
    return {
      attributeFormattedInline,
      attributeFormattedMultiline,
      isMultilineAttribute
    };
  };
  var mergeSiblingPlainStringChildrenReducer = function(previousNodes, currentNode) {
    var nodes = previousNodes.slice(0, previousNodes.length > 0 ? previousNodes.length - 1 : 0);
    var previousNode = previousNodes[previousNodes.length - 1];
    if (previousNode && (currentNode.type === "string" || currentNode.type === "number") && (previousNode.type === "string" || previousNode.type === "number")) {
      nodes.push(createStringTreeNode(String(previousNode.value) + String(currentNode.value)));
    } else {
      if (previousNode) {
        nodes.push(previousNode);
      }
      nodes.push(currentNode);
    }
    return nodes;
  };
  var isKeyOrRefProps = function isKeyOrRefProps2(propName) {
    return ["key", "ref"].includes(propName);
  };
  var sortPropsByNames = function(shouldSortUserProps) {
    return function(props) {
      var haveKeyProp = props.includes("key");
      var haveRefProp = props.includes("ref");
      var userPropsOnly = props.filter(function(oneProp) {
        return !isKeyOrRefProps(oneProp);
      });
      var sortedProps = shouldSortUserProps ? _toConsumableArray(userPropsOnly.sort()) : _toConsumableArray(userPropsOnly);
      if (haveRefProp) {
        sortedProps.unshift("ref");
      }
      if (haveKeyProp) {
        sortedProps.unshift("key");
      }
      return sortedProps;
    };
  };
  function createPropFilter(props, filter) {
    if (Array.isArray(filter)) {
      return function(key) {
        return filter.indexOf(key) === -1;
      };
    } else {
      return function(key) {
        return filter(props[key], key);
      };
    }
  }
  var compensateMultilineStringElementIndentation = function compensateMultilineStringElementIndentation2(element, formattedElement, inline, lvl, options) {
    var tabStop = options.tabStop;
    if (element.type === "string") {
      return formattedElement.split(`
`).map(function(line, offset) {
        if (offset === 0) {
          return line;
        }
        return "".concat(spacer(lvl, tabStop)).concat(line);
      }).join(`
`);
    }
    return formattedElement;
  };
  var formatOneChildren = function formatOneChildren2(inline, lvl, options) {
    return function(element) {
      return compensateMultilineStringElementIndentation(element, formatTreeNode(element, inline, lvl, options), inline, lvl, options);
    };
  };
  var onlyPropsWithOriginalValue = function onlyPropsWithOriginalValue2(defaultProps, props) {
    return function(propName) {
      var haveDefaultValue = Object.keys(defaultProps).includes(propName);
      return !haveDefaultValue || haveDefaultValue && defaultProps[propName] !== props[propName];
    };
  };
  var isInlineAttributeTooLong = function isInlineAttributeTooLong2(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) {
    if (!maxInlineAttributesLineLength) {
      return attributes.length > 1;
    }
    return spacer(lvl, tabStop).length + inlineAttributeString.length > maxInlineAttributesLineLength;
  };
  var shouldRenderMultilineAttr = function shouldRenderMultilineAttr2(attributes, inlineAttributeString, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength) {
    return (isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) || containsMultilineAttr) && !inline;
  };
  var formatReactElementNode = function(node, inline, lvl, options) {
    var { type, displayName: _node$displayName } = node, displayName = _node$displayName === undefined ? "" : _node$displayName, childrens = node.childrens, _node$props = node.props, props = _node$props === undefined ? {} : _node$props, _node$defaultProps = node.defaultProps, defaultProps = _node$defaultProps === undefined ? {} : _node$defaultProps;
    if (type !== "ReactElement") {
      throw new Error('The "formatReactElementNode" function could only format node of type "ReactElement". Given:  '.concat(type));
    }
    var { filterProps: filterProps2, maxInlineAttributesLineLength, showDefaultProps, sortProps, tabStop } = options;
    var out = "<".concat(displayName);
    var outInlineAttr = out;
    var outMultilineAttr = out;
    var containsMultilineAttr = false;
    var visibleAttributeNames = [];
    var propFilter = createPropFilter(props, filterProps2);
    Object.keys(props).filter(propFilter).filter(onlyPropsWithOriginalValue(defaultProps, props)).forEach(function(propName) {
      return visibleAttributeNames.push(propName);
    });
    Object.keys(defaultProps).filter(propFilter).filter(function() {
      return showDefaultProps;
    }).filter(function(defaultPropName) {
      return !visibleAttributeNames.includes(defaultPropName);
    }).forEach(function(defaultPropName) {
      return visibleAttributeNames.push(defaultPropName);
    });
    var attributes = sortPropsByNames(sortProps)(visibleAttributeNames);
    attributes.forEach(function(attributeName) {
      var _formatProp = formatProp(attributeName, Object.keys(props).includes(attributeName), props[attributeName], Object.keys(defaultProps).includes(attributeName), defaultProps[attributeName], inline, lvl, options), attributeFormattedInline = _formatProp.attributeFormattedInline, attributeFormattedMultiline = _formatProp.attributeFormattedMultiline, isMultilineAttribute = _formatProp.isMultilineAttribute;
      if (isMultilineAttribute) {
        containsMultilineAttr = true;
      }
      outInlineAttr += attributeFormattedInline;
      outMultilineAttr += attributeFormattedMultiline;
    });
    outMultilineAttr += `
`.concat(spacer(lvl, tabStop));
    if (shouldRenderMultilineAttr(attributes, outInlineAttr, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength)) {
      out = outMultilineAttr;
    } else {
      out = outInlineAttr;
    }
    if (childrens && childrens.length > 0) {
      var newLvl = lvl + 1;
      out += ">";
      if (!inline) {
        out += `
`;
        out += spacer(newLvl, tabStop);
      }
      out += childrens.reduce(mergeSiblingPlainStringChildrenReducer, []).map(formatOneChildren(inline, newLvl, options)).join(!inline ? `
`.concat(spacer(newLvl, tabStop)) : "");
      if (!inline) {
        out += `
`;
        out += spacer(newLvl - 1, tabStop);
      }
      out += "</".concat(displayName, ">");
    } else {
      if (!isInlineAttributeTooLong(attributes, outInlineAttr, lvl, tabStop, maxInlineAttributesLineLength)) {
        out += " ";
      }
      out += "/>";
    }
    return out;
  };
  var REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX = "";
  var REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX = "React.Fragment";
  var toReactElementTreeNode = function toReactElementTreeNode2(displayName, key, childrens) {
    var props = {};
    if (key) {
      props = {
        key
      };
    }
    return {
      type: "ReactElement",
      displayName,
      props,
      defaultProps: {},
      childrens
    };
  };
  var isKeyedFragment = function isKeyedFragment2(_ref) {
    var key = _ref.key;
    return Boolean(key);
  };
  var hasNoChildren = function hasNoChildren2(_ref2) {
    var childrens = _ref2.childrens;
    return childrens.length === 0;
  };
  var formatReactFragmentNode = function(node, inline, lvl, options) {
    var { type, key, childrens } = node;
    if (type !== "ReactFragment") {
      throw new Error('The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: '.concat(type));
    }
    var useFragmentShortSyntax = options.useFragmentShortSyntax;
    var displayName;
    if (useFragmentShortSyntax) {
      if (hasNoChildren(node) || isKeyedFragment(node)) {
        displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
      } else {
        displayName = REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX;
      }
    } else {
      displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
    }
    return formatReactElementNode(toReactElementTreeNode(displayName, key, childrens), inline, lvl, options);
  };
  var jsxStopChars = ["<", ">", "{", "}"];
  var shouldBeEscaped = function shouldBeEscaped2(s) {
    return jsxStopChars.some(function(jsxStopChar) {
      return s.includes(jsxStopChar);
    });
  };
  var escape = function escape2(s) {
    if (!shouldBeEscaped(s)) {
      return s;
    }
    return "{`".concat(s, "`}");
  };
  var preserveTrailingSpace = function preserveTrailingSpace2(s) {
    var result = s;
    if (result.endsWith(" ")) {
      result = result.replace(/^(.*?)(\s+)$/, "$1{'$2'}");
    }
    if (result.startsWith(" ")) {
      result = result.replace(/^(\s+)(.*)$/, "{'$1'}$2");
    }
    return result;
  };
  var formatTreeNode = function(node, inline, lvl, options) {
    if (node.type === "number") {
      return String(node.value);
    }
    if (node.type === "string") {
      return node.value ? "".concat(preserveTrailingSpace(escape(String(node.value)))) : "";
    }
    if (node.type === "ReactElement") {
      return formatReactElementNode(node, inline, lvl, options);
    }
    if (node.type === "ReactFragment") {
      return formatReactFragmentNode(node, inline, lvl, options);
    }
    throw new TypeError('Unknow format type "'.concat(node.type, '"'));
  };
  var formatTree = function(node, options) {
    return formatTreeNode(node, false, 0, options);
  };
  var reactElementToJsxString = function reactElementToJsxString2(element) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, _ref$filterProps = _ref.filterProps, filterProps2 = _ref$filterProps === undefined ? [] : _ref$filterProps, _ref$showDefaultProps = _ref.showDefaultProps, showDefaultProps = _ref$showDefaultProps === undefined ? true : _ref$showDefaultProps, _ref$showFunctions = _ref.showFunctions, showFunctions = _ref$showFunctions === undefined ? false : _ref$showFunctions, functionValue = _ref.functionValue, _ref$tabStop = _ref.tabStop, tabStop = _ref$tabStop === undefined ? 2 : _ref$tabStop, _ref$useBooleanShorth = _ref.useBooleanShorthandSyntax, useBooleanShorthandSyntax = _ref$useBooleanShorth === undefined ? true : _ref$useBooleanShorth, _ref$useFragmentShort = _ref.useFragmentShortSyntax, useFragmentShortSyntax = _ref$useFragmentShort === undefined ? true : _ref$useFragmentShort, _ref$sortProps = _ref.sortProps, sortProps = _ref$sortProps === undefined ? true : _ref$sortProps, maxInlineAttributesLineLength = _ref.maxInlineAttributesLineLength, displayName = _ref.displayName;
    if (!element) {
      throw new Error("react-element-to-jsx-string: Expected a ReactElement");
    }
    var options = {
      filterProps: filterProps2,
      showDefaultProps,
      showFunctions,
      functionValue,
      tabStop,
      useBooleanShorthandSyntax,
      useFragmentShortSyntax,
      sortProps,
      maxInlineAttributesLineLength,
      displayName
    };
    return formatTree(_parseReactElement(element, options), options);
  };
  exports.default = reactElementToJsxString;
  exports.inlineFunction = inlineFunction;
  exports.preserveFunctionLineBreak = preserveFunctionLineBreak;
});
export default require_cjs();

//# debugId=45B27FAD509C16A264756E2164756E21
//# sourceMappingURL=./chunk-hz3mt98b.js.map
