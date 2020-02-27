const theme = {
  breakpoints: {s: "40em", m: "52em", l: "64em"},
  colors: {
    primary: "red",
    secondary: "green",
    accent: "blue",
    button: {
      bg: "white",
      color: "black",
    },
  },
  space: [0, 4, 8, 16, 32],
}

export const ThemeContext = createContext(theme)
