"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = __importDefault(require("@styled-system/css"));
const hash_sum_1 = __importDefault(require("hash-sum"));
const react_1 = require("react");
const unitlessCssProperties_1 = __importDefault(require("./unitlessCssProperties"));
const addUnitIfNeeded = (name, value) => {
    if (value == null || typeof value === "boolean" || value === "") {
        return "";
    }
    if (typeof value === "number" &&
        value !== 0 &&
        !(name in unitlessCssProperties_1.default)) {
        return `${value}px`; // Presumes implicit 'px' suffix for unitless numbers
    }
    return String(value).trim();
};
const camelCaseToSnakeCase = (prop) => prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
const populateRulesObject = (className, cssObject, acc) => {
    Object.keys(cssObject).forEach(key => {
        const value = cssObject[key];
        if (typeof value === "string" || typeof value === "number") {
            if (!acc[className]) {
                acc[className] = "";
            }
            acc[className] +=
                camelCaseToSnakeCase(key) + ":" + addUnitIfNeeded(key, value) + ";";
        }
        else if (typeof value === "object") {
            if (key.startsWith("@media")) {
                if (!acc[key]) {
                    acc[key] = {};
                }
                populateRulesObject(className, value, acc[key]);
            }
            else {
                populateRulesObject(key.replace(/&/g, className), value, acc);
            }
        }
    });
};
const stylesObjectToRulesObjects = (cssObject) => {
    const rulesObjects = {};
    populateRulesObject("&", cssObject, rulesObjects);
    return rulesObjects;
};
let styleElement;
const alreadyCreatedClassNames = {};
exports.useStyle = (systemObject, theme, deps) => {
    const className = react_1.useMemo(() => {
        const styleObject = css_1.default(systemObject)(theme);
        const hash = hash_sum_1.default(styleObject);
        const className = `style-${hash}`;
        if (!alreadyCreatedClassNames[className]) {
            if (!styleElement) {
                styleElement = document.createElement("style");
                document.head.appendChild(styleElement);
            }
            const sheet = styleElement.sheet;
            const styleRulesObject = stylesObjectToRulesObjects(styleObject);
            const rulesKeys = Object.keys(styleRulesObject).sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            for (const ruleKey of rulesKeys) {
                if (typeof styleRulesObject[ruleKey] === "string") {
                    const selector = ruleKey.replace(/&/g, "." + className);
                    const declaration = styleRulesObject[ruleKey];
                    sheet.insertRule(`${selector}{${declaration}}`, sheet.cssRules.length);
                }
                else {
                    const identifier = ruleKey;
                    const ruleObject = styleRulesObject[identifier];
                    let ruleContent = "";
                    for (const ruleObjectKey in ruleObject) {
                        const selector = ruleObjectKey.replace(/&/g, "." + className);
                        let declaration = ruleObject[ruleObjectKey];
                        ruleContent += `${selector}{${declaration}}`;
                    }
                    sheet.insertRule(`${identifier}{${ruleContent}}`, sheet.cssRules.length);
                }
            }
            alreadyCreatedClassNames[className] = true;
        }
        return className;
        // Assume that systemObject is stable
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, ...(deps ? deps : [])]);
    return className;
};
//# sourceMappingURL=index.js.map