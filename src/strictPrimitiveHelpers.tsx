import React, {useContext} from "react"
import {ThemeContext, DefaultTheme} from "./themeContext"
import {SystemStyleObject, Theme} from "./types"
import {useCss} from "./useCss"
import {valueOrMergeWith} from "./utils"

type RenderAsProps<As> = As extends undefined
  ? {}
  : As extends React.ReactElement
  ? {[key: string]: any}
  : As extends React.ComponentType<infer P>
  ? P
  : As extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[As]
  : never

type PrimitiveProps<U, T extends Theme = DefaultTheme> = {
  renderAs?: (props: RenderAsProps<U>) => JSX.Element
  css?: SystemStyleObject<T>
  deps?: any[]
  className?: string
} & RenderAsProps<U>

type ValueOrMergeWith<U, T extends Theme = DefaultTheme> =
  | U
  | ((value: U, theme: T) => U)

export const createStrictPrimitive = <
  U extends React.ReactType,
  T extends Theme = DefaultTheme
>(
  DefaultComponent: U,
  defaultCss?: ValueOrMergeWith<SystemStyleObject<T>, T>,
  defaultProps?: ValueOrMergeWith<
    Pick<
      RenderAsProps<U>,
      Exclude<RenderAsProps<U>, "renderAs" | "css" | "deps" | "className">
    >,
    T
  >
) => {
  const mergeDefaultcss = valueOrMergeWith(defaultCss)
  const mergeDefaultProps = valueOrMergeWith(defaultProps)

  return ({
    renderAs = (props) => {
      return <DefaultComponent {...props}></DefaultComponent>
    },
    css,
    className,
    deps,
    ...props
  }: PrimitiveProps<U, T>) => {
    const theme = useContext(ThemeContext)
    const cssClassName = useCss(mergeDefaultcss(css, theme), deps)
    const mergedProps = mergeDefaultProps(props, theme)
    const mergedClassName = className
      ? `${className} ${cssClassName}`
      : cssClassName

    return renderAs({
      ...mergedProps,
      className: mergedClassName,
    })
  }
}

type ExtendedPrimitiveProps<U, T extends Theme = DefaultTheme> = {
  css?: SystemStyleObject<T>
} & RenderAsProps<U>

export const extendStrictPrimitive = <
  U extends React.ReactType,
  T extends Theme = DefaultTheme
>(
  Primitive: U,
  defaultCss?: ValueOrMergeWith<SystemStyleObject<T>, T>,
  defaultProps?: ValueOrMergeWith<
    Pick<RenderAsProps<U>, Exclude<RenderAsProps<U>, "css">>,
    T
  >
) => {
  const mergeDefaultCss = valueOrMergeWith(defaultCss)
  const mergeDefaultProps = valueOrMergeWith(defaultProps)

  return React.forwardRef(
    ({css, ...props}: ExtendedPrimitiveProps<U, T>, ref) => {
      const theme = useContext(ThemeContext)
      const mergedCss = mergeDefaultCss(css, theme)
      const mergedProps = mergeDefaultProps(props, theme)

      return <Primitive ref={ref} css={mergedCss} {...mergedProps} />
    }
  )
}
