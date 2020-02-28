import React from "react"
import {ThemeContext} from "@css-system/use-css"

const theme = {
  breakpoints: {
    s: "40em",
    m: "52em",
    l: "64em",
  },
  colors: {
    primary: "red",
    secondary: "green",
    accent: "blue",
    button: {
      bg: "white",
      color: "black",
    },
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
}

export const ThemeProvider = ({children}) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
)
