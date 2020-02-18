# css-system/use-css

A react hook for building versatile design primitives.

## Example

```jsx
import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom";
import { useCss } from "@css-system/use-css";

const theme = {
  breakpoints: ["40em", "52em", "64em"],
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#ff0000"
  },
  space: [0, 4, 8, 16, 32],
  fontSizes: [0, 12, 14, 16, 20, 24, 32, 48, 64, 72]
};

const ThemeContext = createContext(theme);

const View = ({ as: Component = "div", css, ...props }) => {
  const theme = useContext(ThemeContext);
  const className = useCss(
    {
      display: "flex",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      alignSelf: "auto",
      alignItems: "stretch",
      flexDirection: "column",
      justifyContent: "flex-start",
      ...css
    },
    theme
  );

  return <Component className={className} {...props} />;
};

const Text = ({ as: Component = "span", css, ...props }) => {
  const theme = useContext(ThemeContext);
  const className = useCss(
    {
      display: "inline-flex",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      alignSelf: "auto",
      alignItems: "stretch",
      flexDirection: "row",
      justifyContent: "flex-start",
      ...css
    },
    theme
  );

  return <Component className={className} {...props} />;
};

const App = () => {
  return (
    <View
      css={{
        p: [1, 2, 3],
        "&:hover": {
          bg: "text",
          color: "background"
        }
      }}
    >
      <Text css={{ fontSize: [1, 2, 3] }}>Hello world !</Text>
    </View>
  );
};
```
