import {useCss} from "@css-system/use-css"
import React, {createContext, useContext, useState} from "react"

const theme = {
  breakpoints: ["40em", "52em", "64em"],
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
  if (!Array.isArray(flexDirection)) {
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

  const gaps = Array.isArray(gap) ? gap : [gap]
  const flexDirections = flexDirection

  const breakpointsLength = Math.max(flexDirections.length, gaps.length)

  const marginTops = new Array(breakpointsLength)
  const marginLefts = new Array(breakpointsLength)

  for (let index = 0; index < breakpointsLength; index++) {
    const directionForCurrentBreakPoint =
      flexDirections[index] != null ? flexDirections[index] : lastFlexDirection
    lastFlexDirection = directionForCurrentBreakPoint

    const gapForCurrentBreakpoint = gaps[index] != null ? gaps[index] : lastGap
    lastGap = gapForCurrentBreakpoint

    const isDirectionVertical =
      directionForCurrentBreakPoint === "column" ||
      directionForCurrentBreakPoint === "column-reverse"

    if (isDirectionVertical) {
      marginTops[index] = gapForCurrentBreakpoint
      marginLefts[index] = 0
    } else {
      marginTops[index] = 0
      marginLefts[index] = gapForCurrentBreakpoint
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
        flexDirection: ["column", "row"],
        gap: [10, 20, 30],
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
              "&:hover": {bg: ["red", "blue", "green"]},
            }}
          >
            <Text css={{flex: ["1", "none"]}}>{id}</Text>
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
          "&:hover": {bg: ["red", "blue", "green"]},
        }}
      >
        Text
      </Text>
    </View>
  )
}
