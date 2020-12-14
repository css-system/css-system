import {CSS_SYSTEM_CONFIG} from "./config"
import {SystemCssProperties, Theme} from "./types"
import {
  addUnitIfNeeded,
  camelCaseToSnakeCase,
  get,
  positiveOrNegative,
} from "./utils"

export const computeRules = <T extends Theme>(
  systemObject: SystemCssProperties<T>,
  theme: Theme
): string => {
  let result = ""

  for (const key in systemObject) {
    const val = systemObject[key]
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
