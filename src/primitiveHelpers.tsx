import React from "react"
import {DefaultTheme} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"
import {useCss} from "./useCss"

type PrimitiveProps<T extends Theme = DefaultTheme> = {
  as?: any
  css?: SystemStyleObject<T>
  deps?: any[]
  className?: string
  [key: string]: any
}

type ValueOrMergeWith<T, U> = T | ((value: U) => U)

export const createPrimitive = <T extends Theme = DefaultTheme>(
  defaultComponent: React.ReactType,
  defaultCssOrMergeProps?: ValueOrMergeWith<
    SystemStyleObject<T>,
    PrimitiveProps<T>
  >
) => {
  const mergeProps =
    typeof defaultCssOrMergeProps === "function"
      ? defaultCssOrMergeProps
      : <X extends {}>(props: X): X => ({
          css: defaultCssOrMergeProps,
          ...props,
        })

  return React.forwardRef((props: PrimitiveProps<T>, ref) => {
    const {
      as: Component = defaultComponent,
      css,
      deps,
      className,
      ...mergedProps
    } = mergeProps(props)

    const cssClassName = useCss(css, deps)
    const mergedClassName = className
      ? `${className} ${cssClassName}`
      : cssClassName

    return (
      <Component
        ref={ref}
        {...mergedProps}
        className={mergedClassName}
      ></Component>
    )
  })
}

type ExtendedPrimitiveProps<T extends Theme = DefaultTheme> = {
  css?: SystemStyleObject<T>
  [key: string]: any
}

export const extendPrimitive = <T extends Theme = DefaultTheme>(
  Primitive: React.ReactType<ExtendedPrimitiveProps<T>>,
  defaultCssOrMergeProps?: ValueOrMergeWith<
    SystemStyleObject<T>,
    ExtendedPrimitiveProps<T>
  >
) => {
  const mergeProps =
    typeof defaultCssOrMergeProps === "function"
      ? defaultCssOrMergeProps
      : <X extends {}>(props: X): X => ({
          css: defaultCssOrMergeProps,
          ...props,
        })

  return React.forwardRef((props: ExtendedPrimitiveProps<T>, ref) => {
    const {css, ...mergedProps} = mergeProps(props)

    return <Primitive ref={ref} css={css} {...mergedProps} />
  })
}
