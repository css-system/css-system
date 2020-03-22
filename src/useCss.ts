import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {computeCssObject} from "./computeCssObject"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemStyleObject} from "./types"
import {computeRulesObject} from "./computeRulesObject"
import {EMPTY_ARRAY} from "./constants"

export const useCss = (
  systemObject: SystemStyleObject,
  deps: any[] = EMPTY_ARRAY
): string => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext)

  const className = useMemo(() => {
    const cssObject = computeCssObject(systemObject, theme)
    const hash = sum(cssObject)
    const className = `style-${hash}`

    const styleSheet = styleSheetManager.getGlobalStyleSheet()

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
