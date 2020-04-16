import {createContext} from "react"
import {SystemStyleObject} from "./types"

export const defaultTheme = {
  breakpoints: {
    s: "40em",
    m: "52em",
    l: "64em",
  },
  colors: {
    button: "red",
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
} as const

export type DefaultTheme = typeof defaultTheme

export const ThemeContext = createContext(defaultTheme)
