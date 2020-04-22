import {createPrimitive} from "css-system"

export const Button = createPrimitive("button", ({css = {}, ...props}) => {
  return {
    css: {
      py: {_: 2, m: 3},
      px: {_: 3, m: 4},
      bg: "primary",
      border: "none",
      color: "primaryText",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      fontSize: "inherit",
      cursor: "pointer",
      textTransform: "uppercase",
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
