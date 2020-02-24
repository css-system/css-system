import css, {CSSObject, SystemStyleObject, Theme} from "@styled-system/css"
import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {StyleSheetContext} from "./stylesheet"
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

const stylesObjectToRulesObjects = (cssObject: CSSObject): any => {
  const rulesObjects = {}
  populateRulesObject("&", cssObject, rulesObjects)
  return rulesObjects
}

export const useCss = (
  systemObject: SystemStyleObject,
  theme: Theme,
  deps?: any[]
): string => {
  const styleSheet = useContext(StyleSheetContext)

  const className = useMemo(() => {
    const styleObject = css(systemObject)(theme)
    const hash = sum(styleObject)
    const className = `style-${hash}`

    if (!styleSheet.createdClassNames[className]) {
      const styleRulesObject = stylesObjectToRulesObjects(styleObject)

      const rulesKeys = Object.keys(styleRulesObject).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      for (const ruleKey of rulesKeys) {
        if (typeof styleRulesObject[ruleKey] === "string") {
          const selector = ruleKey.replace(/&/g, "." + className)
          const declaration = styleRulesObject[ruleKey]

          styleSheet.insertRule(`${selector}{${declaration}}`)
        } else {
          const identifier = ruleKey
          const ruleObject = styleRulesObject[identifier]

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
  }, [theme, ...(deps ? deps : [])])

  return className
}
