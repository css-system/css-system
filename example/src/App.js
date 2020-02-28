import {useCss} from "@css-system/use-css"
import React, {createContext, useContext, useState} from "react"
import {ThemeContext} from "./theme"
import {createGapRules} from "./createGapRules"

const View = ({as: Component = "div", css, ...props}) => {
  const {gap, ...otherCssProps} = {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...css,
  }

  const theme = useContext(ThemeContext)

  const className = useCss(
    gap
      ? {
          ...otherCssProps,
          ...createGapRules(otherCssProps.flexDirection, gap, theme),
        }
      : otherCssProps,
    theme
  )

  return <Component className={className} {...props} />
}

const Text = ({as: Component = "span", css, ...props}) => {
  const theme = useContext(ThemeContext)
  const className = useCss(
    {
      display: "inline-flex",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      alignItems: "stretch",
      flexDirection: "row",
      justifyContent: "flex-start",
      ...css,
    },
    theme
  )

  return <Component className={className} {...props} />
}

const Button = ({as: Component = "button", css = {}, ...props}) => {
  const theme = useContext(ThemeContext)
  const className = useCss(
    {
      py: {_: 1, m: 2},
      px: {_: 2, m: 3},
      bg: "button.bg",
      border: "2px solid",
      borderColor: "button.color",
      color: "button.color",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      cursor: "pointer",
      ...css,
      "&:active": {
        ...css["&:active"],
        borderColor: "button.bg",
        bg: "button.color",
        color: "button.bg",
      },
      "&:disabled": {
        ...css["&:disabled"],
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    theme
  )

  return <Component className={className} {...props} />
}

export default function App() {
  const [items, setItems] = useState([])

  return (
    <View
      css={{
        flexDirection: {_: "column", m: "row"},
        gap: {_: 1, s: 2, m: 3, l: 4},
      }}
    >
      {items.map(id => {
        return (
          <View
            key={id}
            css={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              p: 10,
              bg: "grey",
              "&:hover": {
                bg: {_: "#55F04A", s: "secondary", m: "accent", l: "#00A265"},
              },
            }}
          >
            <Text>{id}</Text>
            <Button onClick={() => setItems(items.filter(ts => ts !== id))}>
              x
            </Button>
          </View>
        )
      })}
      <Button
        disabled={items.length >= 5}
        onClick={() => setItems([...items, Date.now()])}
      >
        Add view
      </Button>
    </View>
  )
}
