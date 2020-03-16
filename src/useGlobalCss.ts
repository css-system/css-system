import sum from "hash-sum"
import {useContext, useEffect} from "react"
import {computeCssObject} from "./computeCssObject"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemStyleObject} from "./types"
import {computeRulesObject} from "./computeRulesObject"

const defaultDeps = []

export const useGlobalCss = (
  systemObject: SystemStyleObject,
  deps: any[] = defaultDeps
): void => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    const id = sum(systemObject)
    const styleSheet = styleSheetManager.createStyleSheet(id)

    for (const globalSelector in systemObject) {
      const cssObject = computeCssObject(systemObject[globalSelector], theme)

      const rulesObject = computeRulesObject(cssObject)

      const rulesKeys = Object.keys(rulesObject).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      for (const ruleKey of rulesKeys) {
        if (typeof rulesObject[ruleKey] === "string") {
          const selector = ruleKey.replace(/&/g, globalSelector)
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

          styleSheet.insertRule(`${identifier}{${ruleContent}}`)
        }
      }
    }

    styleSheet.createdClassNames[id] = true

    return () => styleSheetManager.removeStyleSheet(id)

    // Assume that systemObject is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ...deps])
}
