import React from "react"
import {DefaultTheme} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"
import {useCss} from "./useCss"

type BasePrimitiveProps<T extends Theme> = {
  css?: SystemStyleObject<T>
  [key: string]: any
}

type PrimitiveProps<T extends Theme> = BasePrimitiveProps<T> & {
  as?: any
  deps?: any[]
  className?: string
}

type ValueOrMergeWith<T> = T | ((value: T) => T)

const createMergeProps = <U extends BasePrimitiveProps<T>, T extends Theme>({
  css: defaultCss,
  ...defaultProps
}: U) => ({css, ...props}: U): U => {
  return {
    ...defaultProps,
    css: {
      ...defaultCss,
      ...css,
    },
    ...props,
  } as U
}

export const createPrimitive = <T extends Theme>(
  defaultComponent: React.ReactType,
  defaultCssOrMergeProps?: ValueOrMergeWith<PrimitiveProps<T>>
) => {
  const mergeProps =
    typeof defaultCssOrMergeProps === "function"
      ? defaultCssOrMergeProps
      : createMergeProps<PrimitiveProps<T>, T>(defaultCssOrMergeProps)

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
  }) as React.ForwardRefExoticComponent<PrimitiveProps<T>>
}

type ExtendedPrimitiveProps<T extends Theme> = {
  css?: SystemStyleObject<T>
  [key: string]: any
}

export const extendPrimitive = <T extends Theme>(
  Primitive: React.ReactType<ExtendedPrimitiveProps<T>>,
  defaultCssOrMergeProps?: ValueOrMergeWith<ExtendedPrimitiveProps<T>>
) => {
  const mergeProps =
    typeof defaultCssOrMergeProps === "function"
      ? defaultCssOrMergeProps
      : createMergeProps<ExtendedPrimitiveProps<T>, T>(defaultCssOrMergeProps)

  return React.forwardRef((props: ExtendedPrimitiveProps<T>, ref) => {
    const {css, ...mergedProps} = mergeProps(props)

    return <Primitive ref={ref} css={css} {...mergedProps} />
  }) as React.ForwardRefExoticComponent<ExtendedPrimitiveProps<T>>
}
