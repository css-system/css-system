import {useCss} from "@css-system/use-css"
import React, {createContext, useContext, useState} from "react"

const theme = {
  breakpoints: {s: "40em", m: "52em", l: "64em"},
  colors: {
    black: "#000e1a",
    white: "#fff",
    blue: "#007ce0",
    primary: "#004175",
  },
  space: [0, 4, 8, 16, 32],
}

const ThemeContext = createContext(theme)

const createGapRules = (flexDirection, gap) => {
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
  const mergedBreakpoints = [
    ...new Set([...Object.keys(flexDirections), ...Object.keys(gaps)]),
  ]

  const marginTops = {}
  const marginLefts = {}
  console.log(flexDirections, gaps)
  for (const mergedBreakpoint of mergedBreakpoints) {
    const directionForCurrentBreakPoint =
      flexDirections[mergedBreakpoint] != null
        ? flexDirections[mergedBreakpoint]
        : lastFlexDirection
    lastFlexDirection = directionForCurrentBreakPoint
    console.log(
      "directionForCurrentBreakPoint",
      mergedBreakpoint,
      directionForCurrentBreakPoint
    )

    const gapForCurrentBreakpoint =
      gaps[mergedBreakpoint] != null ? gaps[mergedBreakpoint] : lastGap
    lastGap = gapForCurrentBreakpoint

    console.log(
      "gapForCurrentBreakpoint",
      mergedBreakpoint,
      gapForCurrentBreakpoint
    )

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

  console.log({
    mt: marginTops,
    ml: marginLefts,
  })

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
    alignSelf: "auto",
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
          ...createGapRules(otherCssProps.flexDirection, gap),
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
      alignSelf: "auto",
      alignItems: "stretch",
      flexDirection: "row",
      justifyContent: "flex-start",
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
        flexDirection: {s: "column", l: "row"},
        gap: {m: 20},
      }}
    >
      {items.map(id => {
        return (
          <View
            key={id}
            css={{
              flexDirection: "row",
              gap: 3,
              bg: "yellow",
              p: 10,
              "&:hover": {bg: {_: "red", s: "blue", m: "green"}},
            }}
          >
            <Text css={{flex: {_: "1", s: "none"}}}>{id}</Text>
            <button onClick={() => setItems(items.filter(ts => ts !== id))}>
              x
            </button>
          </View>
        )
      })}
      <button onClick={() => setItems([...items, Date.now()])}>Add view</button>
      <Text
        css={{
          gap: 3,
          bg: "blue",
          p: 10,
          "&:hover": {bg: {_: "red", s: "blue", m: "green"}},
        }}
      >
        Text
      </Text>
    </View>
  )
}
