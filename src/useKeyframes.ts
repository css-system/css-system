import sum from "hash-sum"
import {useContext, useEffect, useMemo} from "react"
import {StyleSheetManagerContext} from "./stylesheet"
import {ThemeContext, DefaultTheme} from "./themeContext"
import {SystemCssProperties, Theme} from "./types"
import {computeRules} from "./computeRules"
import {EMPTY_ARRAY} from "./constants"

export const useKeyframes = <T extends Theme = DefaultTheme>(
  keyframesObject: Record<string | number, SystemCssProperties<T>>,
  deps: any[] = EMPTY_ARRAY
): string => {
  const styleSheetManager = useContext(StyleSheetManagerContext)
  const theme = useContext(ThemeContext)

  const id = useMemo(() => {
    const id = `keyframes-${sum({keyframesObject, theme})}`
    const styleSheet = styleSheetManager.createStyleSheet(id)

    let frames = ""

    for (const key in keyframesObject) {
      const systemObject = keyframesObject[key]
      const selector = isNaN(key as any) ? key : `${key}%`
      const rules = computeRules(systemObject, theme)
      frames += `${selector}{${rules}}`
    }

    styleSheet.insertRule(`@keyframes ${id}{${frames}}`)

    return id
    // Assume that systemObject is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, ...deps])

  useEffect(() => () => styleSheetManager.removeStyleSheet(id), [id, theme])

  return id
}
