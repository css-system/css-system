import sum from "hash-sum"
import {useContext, useEffect, useMemo} from "react"
import {computeCssObject} from "./computeCssObject"
import {computeRulesObject} from "./computeRulesObject"
import {EMPTY_ARRAY} from "./constants"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"

export const useGlobalCss = <T extends Theme>(
  systemObject: SystemStyleObject<T>,
  deps: any[] = EMPTY_ARRAY
): void => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext)

  const id = useMemo(() => {
    const id = sum({systemObject, theme})
    const styleSheet = styleSheetManager.createStyleSheet(id)

    for (const globalSelector in systemObject) {
      const cssObject = computeCssObject(systemObject[globalSelector], theme)

      const rulesObject = computeRulesObject(cssObject)

      const rulesKeys = Object.keys(rulesObject).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      for (const ruleKey of rulesKeys) {
        if (typeof rulesObject[ruleKey] === "string") {
          const selector = ruleKey
            .replace(/&/g, globalSelector)
            .replace(/#\d#/, "")
          const declaration = rulesObject[ruleKey]

          styleSheet.insertRule(`${selector}{${declaration}}`)
        } else {
          const identifier = ruleKey
          const ruleObject = rulesObject[identifier]

          let ruleContent = ""
          for (const ruleObjectKey in ruleObject) {
            const selector = ruleObjectKey.replace(/&/g, globalSelector)
            let declaration = ruleObject[ruleObjectKey]
            ruleContent += `${selector}{${declaration}}`
          }

          styleSheet.insertRule(
            `${identifier.replace(/#\d#/, "")}{${ruleContent}}`
          )
        }
      }
    }

    return id
  }, [theme, ...deps])

  useEffect(() => () => styleSheetManager.removeStyleSheet(id), [
    id,
    theme,
    ...deps,
  ])
}
