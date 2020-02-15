import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState
} from "react";
import css from "@styled-system/css";
import unitless from "./unitless.js";
import sum from "./hash.js";

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
  breakpoints: ["40em", "52em", "64em"],
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
      if (key.startsWith("@media")) {
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

const ThemeContext = createContext(theme);

const hashToCount = {};

const stylesObjectToRulesObjects = cssObject => {
  const rulesObjects = {};
  populateRulesObject("&", cssObject, rulesObjects);
  return rulesObjects;
};

const useStyle = (systemObject, theme) => {
  const result = useMemo(() => {
    const styleObject = css(systemObject)(theme);
    const hash = sum(styleObject);
    const className = `style-${hash}`;
    return { styleObject, className };
    // Assume that systemObject is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    const { styleObject, className } = result;

    let styleElement;

    if (hashToCount[className]) {
      hashToCount[className]++;
      styleElement = document.getElementById(className);
    } else {
      styleElement = document.createElement("style");
      document.head.appendChild(styleElement);
      styleElement.setAttribute("id", className);

      const styleRulesObject = stylesObjectToRulesObjects(styleObject);

      const rulesKeys = Object.keys(styleRulesObject).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      );

      for (const ruleKey of rulesKeys) {
        if (typeof styleRulesObject[ruleKey] === "string") {
          const selector = ruleKey.replace(/&/g, "." + className);
          const declaration = styleRulesObject[ruleKey];

          styleElement.sheet.insertRule(
            `${selector}{${declaration}}`,
            styleElement.sheet.cssRules.length
          );
        } else {
          const identifier = ruleKey;
          const ruleObject = styleRulesObject[identifier];

          let ruleContent = "";
          for (const ruleObjectKey in ruleObject) {
            const selector = ruleObjectKey.replace(/&/g, "." + className);
            let declaration = ruleObject[ruleObjectKey];
            ruleContent += `${selector}{${declaration}}`;
          }

          styleElement.sheet.insertRule(
            `${identifier}{${ruleContent}}`,
            styleElement.sheet.cssRules.length
          );
        }
      }

      hashToCount[className] = 1;
    }

    return () => {
      if (hashToCount[className] === 1) {
        styleElement.remove();
      }

      hashToCount[className]--;
    };
  }, [result]);

  return result.className;
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

  const theme = useContext(ThemeContext);

  const className = useStyle(
    gap
      ? {
          ...otherCssProps,
          "& > * + *": {
            [otherCssProps.flexDirection === "column" ? "mt" : "ml"]: gap
          }
        }
      : otherCssProps,
    theme
  );

  return <Component className={className} {...props} />;
};

export default function App() {
  const [items, setItems] = useState([]);

  return (
    <View css={{ gap: [0, 1, 3], "&:hover": { bg: ["red", "primary"] } }}>
      {items.map(id => {
        return (
          <View
            key={id}
            css={{ flexDirection: "row", gap: 3, bg: "yellow", p: 10 }}
          >
            {id}
            <button onClick={() => setItems(items.filter(ts => ts !== id))}>
              x
            </button>
          </View>
        );
      })}
      <button onClick={() => setItems([...items, Date.now()])}>Add view</button>
    </View>
  );
}
