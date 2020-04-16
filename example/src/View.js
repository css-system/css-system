import {createLoosePrimitive, useGap} from "css-system"

export const View = createLoosePrimitive("div", (css) => {
  return useGap({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    ...css,
  })
})
