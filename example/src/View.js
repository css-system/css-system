import {createPrimitive, useGap} from "css-system"

export const View = createPrimitive("div", ({css, ...props}) => {
  return {
    css: useGap({
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      ...css,
    }),
    ...props,
  }
})
