import unitlessCssProperties from "./unitlessCssProperties"
import {CSSObject} from "./types"

const addUnitIfNeeded = (name: string, value: unknown): string => {
  if (value == null || typeof value === "boolean" || value === "") {
    return ""
  }

  if (
    typeof value === "number" &&
    value !== 0 &&
    !(name in unitlessCssProperties)
  ) {
    return `${value}px` // Presumes implicit 'px' suffix for unitless numbers
  }

  return String(value).trim()
}

const camelCaseToSnakeCase = (prop: string): string =>
  prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

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
