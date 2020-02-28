import {SystemStyleObject, Theme, CSSObject} from "./types"

const get = (obj: Object, path: string | number, def?: any) => {
  let result = obj
  const keys = typeof path === "string" ? path.split(".") : [path]
  for (const key of keys) {
    result = result ? result[key] : undefined
  }
  return result === undefined ? def : result
}

const aliases = {
  bg: "backgroundColor",
  m: "margin",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  ml: "marginLeft",
  mx: "marginX",
  my: "marginY",
  p: "padding",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  pl: "paddingLeft",
  px: "paddingX",
  py: "paddingY",
}

const multiples = {
  marginX: ["marginLeft", "marginRight"],
  marginY: ["marginTop", "marginBottom"],
  paddingX: ["paddingLeft", "paddingRight"],
  paddingY: ["paddingTop", "paddingBottom"],
  size: ["width", "height"],
}

const scales = {
  color: "colors",
  backgroundColor: "colors",
  borderColor: "colors",
  margin: "space",
  marginTop: "space",
  marginRight: "space",
  marginBottom: "space",
  marginLeft: "space",
  marginX: "space",
  marginY: "space",
  padding: "space",
  paddingTop: "space",
  paddingRight: "space",
  paddingBottom: "space",
  paddingLeft: "space",
  paddingX: "space",
  paddingY: "space",
  top: "space",
  right: "space",
  bottom: "space",
  left: "space",
  gridGap: "space",
  gridColumnGap: "space",
  gridRowGap: "space",
  gap: "space",
  columnGap: "space",
  rowGap: "space",
  fontFamily: "fonts",
  fontSize: "fontSizes",
  fontWeight: "fontWeights",
  lineHeight: "lineHeights",
  letterSpacing: "letterSpacings",
  border: "borders",
  borderTop: "borders",
  borderRight: "borders",
  borderBottom: "borders",
  borderLeft: "borders",
  borderWidth: "borderWidths",
  borderStyle: "borderStyles",
  borderRadius: "radii",
  borderTopRightRadius: "radii",
  borderTopLeftRadius: "radii",
  borderBottomRightRadius: "radii",
  borderBottomLeftRadius: "radii",
  borderTopWidth: "borderWidths",
  borderTopColor: "colors",
  borderTopStyle: "borderStyles",
  borderBottomWidth: "borderWidths",
  borderBottomColor: "colors",
  borderBottomStyle: "borderStyles",
  borderLeftWidth: "borderWidths",
  borderLeftColor: "colors",
  borderLeftStyle: "borderStyles",
  borderRightWidth: "borderWidths",
  borderRightColor: "colors",
  borderRightStyle: "borderStyles",
  outlineColor: "colors",
  boxShadow: "shadows",
  textShadow: "shadows",
  zIndex: "zIndices",
  width: "sizes",
  minWidth: "sizes",
  maxWidth: "sizes",
  height: "sizes",
  minHeight: "sizes",
  maxHeight: "sizes",
  flexBasis: "sizes",
  size: "sizes",
  // svg
  fill: "colors",
  stroke: "colors",
}

const positiveOrNegative = (scale, value) => {
  if (typeof value !== "number" || value >= 0) {
    return get(scale, value, value)
  }
  const absolute = Math.abs(value)
  const n = get(scale, absolute, absolute)
  if (typeof n === "string") {
    return "-" + n
  }

  return n * -1
}

const transforms = [
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginX",
  "marginY",
  "top",
  "bottom",
  "left",
  "right",
].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: positiveOrNegative,
  }),
  {}
)

const responsive = (systemObject: SystemStyleObject, theme: Theme) => {
  const next = {}
  const breakpoints = get(theme, "breakpoints")

  const mediaQueries = Object.keys(breakpoints).reduce(
    (acc, breakpointKey) => {
      return {
        ...acc,
        [breakpointKey]: `@media screen and (min-width: ${breakpoints[breakpointKey]})`,
      }
    },
    {_: null}
  )

  for (const key in systemObject) {
    const value = systemObject[key]
    const type = typeof value

    if (value == null || Array.isArray(value)) {
      continue
    }

    if (key.includes("&") || type === "string" || type === "number") {
      next[key] = value
      continue
    }

    const breakpointKeys = Object.keys(value)
    for (const breakpointKey of breakpointKeys) {
      const media = mediaQueries[breakpointKey]
      if (!media) {
        next[key] = value[breakpointKey]
        continue
      }
      next[media] = next[media] || {}
      if (value[breakpointKey] == null) continue

      next[media][key] = value[breakpointKey]
    }
  }

  return next
}

export const computeCssObject = (
  systemObject: SystemStyleObject,
  theme: Theme
): CSSObject => {
  let result = {}
  const styles = responsive(systemObject, theme)
  for (const key in styles) {
    const x = styles[key]
    const val = typeof x === "function" ? x(theme) : x

    if (key === "variant") {
      const variant = computeCssObject(get(theme, val), theme)
      result = {
        ...result,
        ...variant,
      }
      continue
    }

    if (val && typeof val === "object") {
      result[key] = computeCssObject(val, theme)
      continue
    }

    const prop = get(aliases, key, key)
    const scaleName = get(scales, prop)
    const scale = get(theme, scaleName, get(theme, prop, {}))
    const transform = get(transforms, prop, get)
    const value = transform(scale, val, val)

    if (multiples[prop]) {
      const dirs = multiples[prop]

      for (let i = 0; i < dirs.length; i++) {
        result[dirs[i]] = value
      }
    } else {
      result[prop] = value
    }
  }

  return result
}
