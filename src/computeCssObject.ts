import {aliases, multiples, scales} from "./constants"
import {CSSObject, SystemStyleObject, Theme} from "./types"
import {get, transforms} from "./utils"

const responsive = <T extends Theme>(
  systemObject: SystemStyleObject<T>,
  theme: T
) => {
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

export const computeCssObject = <T extends Theme>(
  systemObject: SystemStyleObject<T>,
  theme: T
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
