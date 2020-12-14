import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {computeCssObject} from "./computeCssObject"
import {computeRulesObject} from "./computeRulesObject"
import {EMPTY_ARRAY} from "./constants"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"

export const useCss = <T extends Theme>(
  systemObject: SystemStyleObject<T>,
  deps: any[] = EMPTY_ARRAY
): string => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext) as Theme

  const className = useMemo(() => {
    const cssObject = computeCssObject(systemObject, theme)
    const hash = sum(cssObject)
    const className = `style-${hash}`

    const styleSheet = styleSheetManager.getGlobalStyleSheet()

    if (!styleSheet.createdIds[className]) {
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

          styleSheet.insertRule(
            `${identifier.replace(/#\d#/, "")}{${ruleContent}}`
          )
        }
      }

      styleSheet.createdIds[className] = true
    }

    return className
  }, [theme, ...deps])

  return className
}
