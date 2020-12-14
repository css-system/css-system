import {CSS_SYSTEM_CONFIG} from "./config"
import {SystemStyleObject, Theme} from "./types"
import {get, positiveOrNegative} from "./utils"

const responsive = <T extends Theme>(
  systemObject: SystemStyleObject<T>,
  theme: Theme
) => {
  const next = {}
  const breakpoints = get(theme, "breakpoints")

  const mediaQueries = Object.entries(breakpoints).reduce(
    (acc, [key, value], index) => {
      return {
        ...acc,
        [key]: `@media screen and (min-width: #${index}#${value})`,
      }
    },
    {_: null}
  )

  for (const key in systemObject) {
    const value = systemObject[key]
    const type = typeof value

    if (value == null) {
      continue
    }

    if (
      key.includes("&") ||
      key.startsWith("@") ||
      type === "string" ||
      type === "number"
    ) {
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
  theme: Theme
) => {
  let result = {}
  const styles = responsive(systemObject, theme)
  for (const key in styles) {
    const val = styles[key]

    if (val && typeof val === "object") {
      result[key] = computeCssObject(val, theme)
      continue
    }

    const prop = get(CSS_SYSTEM_CONFIG.propertyAliases, key, key)
    const scaleName = get(CSS_SYSTEM_CONFIG.propertyScales, prop)
    const scale = get(theme, scaleName, get(theme, prop, {}))
    const value =
      prop in CSS_SYSTEM_CONFIG.negativeProperties
        ? positiveOrNegative(scale, val)
        : get(scale, val, val)

    if (CSS_SYSTEM_CONFIG.multiplePropertyAliases[prop]) {
      const dirs = CSS_SYSTEM_CONFIG.multiplePropertyAliases[prop]

      for (let i = 0; i < dirs.length; i++) {
        result[dirs[i]] = value
      }
    } else {
      result[prop] = value
    }
  }

  return result
}
