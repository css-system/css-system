import React, {useContext} from "react"
import {ThemeContext, DefaultTheme} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"
import {useCss} from "./useCss"
import {valueOrMergeWith} from "./utils"

type PrimitiveProps<T extends Theme = DefaultTheme> = {
  as?: any
  css?: SystemStyleObject<T>
  deps?: any[]
  className?: string
  [key: string]: any
}

type ValueOrMergeWith<U, T extends Theme = DefaultTheme> =
  | U
  | ((value: U, theme: T) => U)

export const createLoosePrimitive = <
  U extends React.ReactType,
  T extends Theme = DefaultTheme
>(
  defaultComponent: U,
  defaultCss?: ValueOrMergeWith<SystemStyleObject<T>, T>,
  defaultProps?: ValueOrMergeWith<{[key: string]: any}, T>
) => {
  const mergeDefaultCss = valueOrMergeWith(defaultCss)
  const mergeDefaultProps = valueOrMergeWith(defaultProps)

  return React.forwardRef<unknown, PrimitiveProps<T>>(
    (
      {
        as: Component = defaultComponent,
        css,
        deps,
        className,
        ...props
      }: PrimitiveProps<T>,
      ref
    ) => {
      const theme = useContext(ThemeContext)
      const cssClassName = useCss(mergeDefaultCss(css, theme), deps)
      const mergedProps = mergeDefaultProps(props, theme)

      return (
        <Component
          ref={ref}
          {...mergedProps}
          className={`${cssClassName} ${className || ""}`}
        />
      )
    }
  ) as React.ForwardRefExoticComponent<PrimitiveProps<T>>
}

type ExtendedPrimitiveProps<T extends Theme = DefaultTheme> = {
  css?: SystemStyleObject<T>
  [key: string]: any
}
export const extendLoosePrimitive = <
  U extends React.ReactType<ExtendedPrimitiveProps<T>>,
  T extends Theme = DefaultTheme
>(
  Primitive: U,
  defaultCss?: ValueOrMergeWith<SystemStyleObject<T>>,
  defaultProps?: ValueOrMergeWith<{[key: string]: any}>
) => {
  const mergeDefaultCss = valueOrMergeWith(defaultCss)
  const mergeDefaultProps = valueOrMergeWith(defaultProps)

  return React.forwardRef(({css, ...props}: ExtendedPrimitiveProps<T>, ref) => {
    const theme = useContext(ThemeContext)
    const mergedCss = mergeDefaultCss(css, theme)
    const mergedProps = mergeDefaultProps(props, theme)

    return <Primitive ref={ref} css={mergedCss} {...mergedProps} />
  }) as React.ForwardRefExoticComponent<ExtendedPrimitiveProps<T>>
}
