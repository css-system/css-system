import {SystemCssProperties, Theme} from "./types"
import {unitlessCssProperties, aliases, scales, multiples} from "./constants"
import {transforms, get, camelCaseToSnakeCase, addUnitIfNeeded} from "./utils"

export const computeRules = (
  systemObject: SystemCssProperties,
  theme: Theme
): string => {
  let result = ""

  for (const key in systemObject) {
    const x = systemObject[key]
    const val = typeof x === "function" ? x(theme) : x
    const prop = get(aliases, key, key)
    const scaleName = get(scales, prop)
    const scale = get(theme, scaleName, get(theme, prop, {}))
    const transform = get(transforms, prop, get)
    const value = transform(scale, val, val)

    if (multiples[prop]) {
      const dirs = multiples[prop]

      for (let i = 0; i < dirs.length; i++) {
        result +=
          camelCaseToSnakeCase(dirs[i]) +
          ":" +
          addUnitIfNeeded(prop, value) +
          ";"
      }
    } else {
      result +=
        camelCaseToSnakeCase(prop) + ":" + addUnitIfNeeded(prop, value) + ";"
    }
  }

  return result
}
