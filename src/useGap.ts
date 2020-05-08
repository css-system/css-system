import {SystemStyleObject, Theme, ResponsiveStyleValue} from "./types"
import {useMemo, useContext} from "react"
import {ThemeContext, DefaultTheme} from "./themeContext"

export const useGap = <T extends Theme>({
  gap,
  ...otherCssProps
}: SystemStyleObject<T> & {
  gap?:
    | string
    | number
    | ResponsiveStyleValue<T["breakpoints"], string | number>
}): SystemStyleObject<T> => {
  const flexDirection = otherCssProps.flexDirection
  const theme = useContext(ThemeContext)
  const gapCssProps = useMemo(() => {
    if (gap && flexDirection) {
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
  }, [gap, flexDirection, theme])

  return gap
    ? {
        ...otherCssProps,
        ...gapCssProps,
      }
    : otherCssProps
}
