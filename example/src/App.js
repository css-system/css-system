import {useCss} from "@css-system/use-css"
import React, {createContext, useContext, useState} from "react"

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

const ThemeContext = createContext(theme)

const createGapRules = (flexDirection, gap, theme) => {
  if (typeof flexDirection === "string") {
    const isDirectionVertical =
      flexDirection === "column" || flexDirection === "column-reverse"

    return {
      "& > * + *": {
        [isDirectionVertical ? "mt" : "ml"]: gap,
      },
    }
  }

  let lastFlexDirection
  let lastGap

  const gaps = typeof gap === "object" ? gap : {_: gap}
  const flexDirections = flexDirection
  const mergedBreakpointsSet = new Set([
    ...Object.keys(flexDirections),
    ...Object.keys(gaps),
  ])

  const marginTops = {}
  const marginLefts = {}
  const themeBreakpoints = ["_", ...Object.keys(theme.breakpoints)]

  for (const themeBreakpoint of themeBreakpoints) {
    if (mergedBreakpointsSet.has(themeBreakpoint) === false) {
      continue
    }

    const mergedBreakpoint = themeBreakpoint

    const directionForCurrentBreakPoint =
      flexDirections[mergedBreakpoint] != null
        ? flexDirections[mergedBreakpoint]
        : lastFlexDirection
    lastFlexDirection = directionForCurrentBreakPoint

    const gapForCurrentBreakpoint =
      gaps[mergedBreakpoint] != null ? gaps[mergedBreakpoint] : lastGap
    lastGap = gapForCurrentBreakpoint

    const isDirectionVertical =
      directionForCurrentBreakPoint === "column" ||
      directionForCurrentBreakPoint === "column-reverse"

    if (isDirectionVertical) {
      marginTops[mergedBreakpoint] = gapForCurrentBreakpoint
      marginLefts[mergedBreakpoint] = 0
    } else {
      marginLefts[mergedBreakpoint] = gapForCurrentBreakpoint
      marginTops[mergedBreakpoint] = 0
    }
  }

  return {
    "& > * + *": {
      mt: marginTops,
      ml: marginLefts,
    },
  }
}

const View = ({as: Component = "div", css, ...props}) => {
  const {gap, ...otherCssProps} = {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...css,
  }

  const theme = useContext(ThemeContext)

  const className = useCss(
    gap
      ? {
          ...otherCssProps,
          ...createGapRules(otherCssProps.flexDirection, gap, theme),
        }
      : otherCssProps,
    theme
  )

  return <Component className={className} {...props} />
}

const Text = ({as: Component = "span", css, ...props}) => {
  const theme = useContext(ThemeContext)
  const className = useCss(
    {
      display: "inline-flex",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      alignItems: "stretch",
      flexDirection: "row",
      justifyContent: "flex-start",
      ...css,
    },
    theme
  )

  return <Component className={className} {...props} />
}

const Button = ({as: Component = "button", css, ...props}) => {
  const theme = useContext(ThemeContext)
  const className = useCss(
    {
      py: {_: 1, m: 2},
      px: {_: 2, m: 3},
      bg: "button.bg",
      border: "2px solid",
      borderColor: "button.color",
      color: "button.color",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      cursor: "pointer",
      "&:active": {
        borderColor: "button.bg",
        bg: "button.color",
        color: "button.bg",
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
      ...css,
    },
    theme
  )

  return <Component className={className} {...props} />
}

export default function App() {
  const [items, setItems] = useState([])

  return (
    <View
      css={{
        flexDirection: {_: "column", m: "row"},
        gap: {_: 0, s: 1, m: 2, l: 3},
      }}
    >
      {items.map(id => {
        return (
          <View
            key={id}
            css={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              p: 10,
              bg: "grey",
              "&:hover": {
                bg: {_: "#55F04A", s: "secondary", m: "accent", l: "#00A265"},
              },
            }}
          >
            <Text>{id}</Text>
            <Button onClick={() => setItems(items.filter(ts => ts !== id))}>
              x
            </Button>
          </View>
        )
      })}
      <Button
        disabled={items.length >= 5}
        onClick={() => setItems([...items, Date.now()])}
      >
        Add view
      </Button>
    </View>
  )
}
