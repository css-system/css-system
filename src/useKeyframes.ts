import sum from "hash-sum"
import {useContext, useMemo} from "react"
import {computeRules} from "./computeRules"
import {EMPTY_ARRAY} from "./constants"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext} from "./themeContext"
import {SystemCssProperties, Theme} from "./types"

export const useKeyframes = <T extends Theme>(
  keyframesObject: Record<string | number, SystemCssProperties<T>>,
  deps: any[] = EMPTY_ARRAY
): string => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext) as Theme

  const id = useMemo(() => {
    const id = `keyframes-${sum({keyframesObject, theme})}`

    const styleSheet = styleSheetManager.getGlobalStyleSheet()

    if (!styleSheet.createdIds[id]) {
      let frames = ""

      for (const key in keyframesObject) {
        const systemObject = keyframesObject[key]
        const selector = isNaN(key as any) ? key : `${key}%`
        const rules = computeRules(systemObject, theme)
        frames += `${selector}{${rules}}`
      }

      styleSheet.insertRule(`@keyframes ${id}{${frames}}`)

      styleSheet.createdIds[id] = true
    }

    return id
  }, [theme, ...deps])

  return id
}
