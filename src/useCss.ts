import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {computeCssObject} from "./computeCssObject"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"
import {computeRulesObject} from "./computeRulesObject"
import {EMPTY_ARRAY} from "./constants"

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

      const rulesKeys = Object.keys(rulesObject).sort((ruleKeyA, ruleKeyB) => {
        if (ruleKeyA[0] === "@" && ruleKeyB[0] === "@") {
          return 0
        }
        if (ruleKeyA[0] === "@" && ruleKeyB[0] !== "@") {
          return 1
        }
        return -1
      })

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

      styleSheet.createdIds[className] = true
    }

    return className
    // Assume that systemObject is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ...deps])

  return className
}
