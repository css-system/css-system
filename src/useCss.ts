import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {computeCssObject} from "./computeCssObject"
import {StyleSheetContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {CSSObject, SystemStyleObject} from "./types"
import unitlessCssProperties from "./unitlessCssProperties"

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

const computeRulesObject = (cssObject: CSSObject): any => {
  const rulesObject = {}
  populateRulesObject("&", cssObject, rulesObject)
  return rulesObject
}

const defaultDeps = []

export const useCss = (
  systemObject: SystemStyleObject,
  deps: any[] = defaultDeps
): string => {
  const styleSheet = useContext(StyleSheetContext)
  const theme = useContext(ThemeContext)

  const className = useMemo(() => {
    const cssObject = computeCssObject(systemObject, theme)
    const hash = sum(cssObject)
    const className = `style-${hash}`

    if (!styleSheet.createdClassNames[className]) {
      const rulesObject = computeRulesObject(cssObject)

      const rulesKeys = Object.keys(rulesObject).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      for (const ruleKey of rulesKeys) {
        if (typeof rulesObject[ruleKey] === "string") {
          const selector = ruleKey.replace(/&/g, "." + className)
          const declaration = rulesObject[ruleKey]

          styleSheet.insertRule(`${selector}{${declaration}}`)
        } else {
          const identifier = ruleKey
          const ruleObject = rulesObject[identifier]

          let ruleContent = ""
          for (const ruleObjectKey in ruleObject) {
            const selector = ruleObjectKey.replace(/&/g, "." + className)
            let declaration = ruleObject[ruleObjectKey]
            ruleContent += `${selector}{${declaration}}`
          }

          styleSheet.insertRule(`${identifier}{${ruleContent}}`)
        }
      }

      styleSheet.createdClassNames[className] = true
    }

    return className
    // Assume that systemObject is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ...deps])

  return className
}
