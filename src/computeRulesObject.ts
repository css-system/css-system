import {CSSObject} from "./types"
import {camelCaseToSnakeCase, addUnitIfNeeded} from "./utils"

const populateRulesObject = (
  className: string,
  cssObject: CSSObject,
  acc: any
) => {
  Object.keys(cssObject).forEach(key => {
    const value = cssObject[key]
    if (typeof value === "string" || typeof value === "number") {
      if (!acc[className]) {
        acc[className] = ""
      }
      acc[className] +=
        camelCaseToSnakeCase(key) + ":" + addUnitIfNeeded(key, value) + ";"
    } else if (typeof value === "object") {
      if (key.startsWith("@media")) {
        if (!acc[key]) {
          acc[key] = {}
        }
        populateRulesObject(className, value, acc[key])
      } else {
        populateRulesObject(key.replace(/&/g, className), value, acc)
      }
    }
  })
}

export const computeRulesObject = (cssObject: CSSObject): any => {
  const rulesObject = {}
  populateRulesObject("&", cssObject, rulesObject)
  return rulesObject
}
