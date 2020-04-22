import {createPrimitive} from "css-system"

export const Input = createPrimitive("input", ({css = {}, ...props}) => {
  return {
    css: {
      py: {_: 2, m: 3},
      px: {_: 3, m: 4},
      bg: "lightPrimary",
      color: "lightPrimaryText",
      border: "none",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      fontSize: "inherit",
      ...css,
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5,
        ...css["&:disabled"],
      },
    },
    ...props,
  }
})
