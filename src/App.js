import React from "react";
import css from "@styled-system/css";

import unitless from "./unitless.js";

const addUnitIfNeeded = (name, value) => {
  if (value == null || typeof value === "boolean" || value === "") {
    return "";
  }

  if (typeof value === "number" && value !== 0 && !(name in unitless)) {
    return `${value}px`; // Presumes implicit 'px' suffix for unitless numbers
  }

  return String(value).trim();
};

const camelCaseToSnakeCase = prop =>
  prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

const theme = {
  colors: {
    black: "#000e1a",
    white: "#fff",
    blue: "#007ce0",
    primary: "#004175"
  },
  space: [0, 4, 8, 16]
};

const populateRulesObject = (className, cssObject, acc) => {
  Object.keys(cssObject).forEach(key => {
    const value = cssObject[key];
    if (typeof value === "string" || typeof value === "number") {
      if (!acc[className]) {
        acc[className] = "";
      }
      acc[className] +=
        camelCaseToSnakeCase(key) + ":" + addUnitIfNeeded(key, value) + ";";
    } else if (typeof value === "object") {
      if (key.startsWith("@")) {
        if (!acc[key]) {
          acc[key] = {};
        }
        populateRulesObject(className, value, acc[key]);
      } else {
        populateRulesObject(key.replace(/&/g, className), value, acc);
      }
    }
  });
};

const stylesObjectToRulesObjects = cssObject => {
  const rulesObjects = {};
  populateRulesObject("&", cssObject, rulesObjects);
  return rulesObjects;
};

const styleEl = document.createElement("style");
document.head.appendChild(styleEl);
const sheet = styleEl.sheet;

const systemToClassMap = {};

const useClassName = systemObject => {
  const styleObjectHash = JSON.stringify(systemObject);

  if (systemToClassMap[styleObjectHash]) {
    return systemToClassMap[styleObjectHash];
  }

  const id = sheet.cssRules.length.toString(36);
  const className = `css-${id}`;
  const stylesObject = css(systemObject)(theme);
  console.log("stylesObject", stylesObject);
  const styleRulesObject = stylesObjectToRulesObjects(stylesObject);

  const rulesKeys = Object.keys(styleRulesObject).sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  );

  console.log("styleRulesObject", JSON.stringify(styleRulesObject, null, 2));

  rulesKeys.forEach(ruleKey => {
    if (typeof styleRulesObject[ruleKey] === "string") {
      const selector = ruleKey.replace(/&/g, "." + className);
      const declaration = styleRulesObject[ruleKey];

      sheet.insertRule(`${selector}{${declaration}}`, sheet.cssRules.length);
    } else {
      const identifier = ruleKey;
      const ruleObject = styleRulesObject[identifier];
      const ruleContent = Object.keys(ruleObject)
        .map(ruleObjectKey => {
          const selector = ruleObjectKey.replace(/&/g, "." + className);
          const declaration = ruleObject[ruleObjectKey];
          return `${selector}{${declaration}}`;
        })
        .join("");

      sheet.insertRule(`${identifier}{${ruleContent}}`, sheet.cssRules.length);
    }
  });

  systemToClassMap[styleObjectHash] = className;

  return className;
};

const View = ({ as: Component = "div", css, ...props }) => {
  const { gap, ...otherCssProps } = {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    alignSelf: "auto",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...css
  };

  const className = useClassName(
    gap
      ? {
          ...otherCssProps,
          "& > * + *": {
            [otherCssProps.flexDirection === "column" ? "mt" : "ml"]: gap
          }
        }
      : otherCssProps
  );

  return <Component className={className} {...props} />;
};

const prout = new Array(10000).fill("zizi").map((value, index) => index);

export default function App() {
  return (
    <View css={{ gap: [0, 1, 3], "&:hover": { bg: ["red", "primary"] } }}>
      {prout.map(index => {
        return <View css={{ fontSize: index + "px" }}>{index}p</View>;
      })}
    </View>
  );
}
