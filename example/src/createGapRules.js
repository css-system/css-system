export const createGapRules = (flexDirection, gap, theme) => {
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
