import {useCss} from "@css-system/use-css"
import React from "react"

export const Text = ({as: Component = "span", css, deps, ...props}) => {
  const className = useCss(
    {
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      ...css,
    },
    deps
  )

  return <Component className={className} {...props} />
}
