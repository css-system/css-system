# css-system/use-css

[![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/@css-system/use-css.svg?style=flat-square
[npm]: https://www.npmjs.org/package/@css-system/use-css

A react hook for building versatile design primitives.

It follow the [theme ui specifications](https://github.com/system-ui/theme-specification).

## Example

```jsx
import React, {createContext, useContext} from "react"
import ReactDOM from "react-dom"
import {useCss, useGlobalCss, ThemeContext} from "@css-system/use-css"

const theme = {
  breakpoints: {s: "40em", m: "52em", l: "64em"},
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#ff0000",
  },
  space: [0, 4, 8, 16, 32, 64, 128],
  fontSizes: [0, 12, 14, 16, 20, 24, 32, 48, 64, 72],
}

const View = ({as: Component = "div", css, ...props}) => {
  const className = useCss({
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...css,
  })

  return <Component className={className} {...props} />
}

const Text = ({as: Component = "span", css, ...props}) => {
  const className = useCss({
    display: "inline",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    ...css,
  })

  return <Component className={className} {...props} />
}

const App = () => {
  useGlobalCss({
    body: {
      p: {_: 5, m: 6},
    },
    "*, *:before, *:after": {
      boxSizing: "border-box",
    },
  })

  return (
    <ThemeContext.Provider value={theme}>
      <View
        css={{
          p: {_: 0, s: 1, m: 2, l: 3},
          "&:hover": {
            bg: "text",
            color: "background",
          },
        }}
      >
        <Text css={{fontSize: {_: 1, m: 2}}}>Hello world !</Text>
      </View>
    </ThemeContext.Provider>
  )
}
```
