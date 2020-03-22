# css-system

[![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/use-css.svg?style=flat-square
[npm]: https://www.npmjs.org/package/use-css

React hooks for building versatile design primitives.

It follow the [theme ui specifications](https://github.com/system-ui/theme-specification) and was heavily influenced by [styled-system](https://github.com/styled-system/styled-system).

```sh
yarn add css-system
```

## Features

- Easily create your own design primitive
- Speak in intentions instead of absolute values with theme first class support
- Create responsive UIs without ever writing a media query
- Supports Server Side Rendering

## Try It Out

You can run the example todo list app by cloning this project and running the following command at the project root

```sh
yarn && yarn --cwd example && yarn --cwd example start
```

## Usage

```jsx
import React from "react"
import {useCss} from "css-system"

// Create your own design primitive and chose its default style
const View = ({as: Component = "div", css, ...props}) => {
  const className = useCss({
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flex: "none",
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...css,
  })

  return <Component className={className} {...props} />
}

// Easily create great ui using it
export const App = () => (
  <View css={{color: "primary", fontSize: 4}}>Hello world</View>
)
```

## First class support for theme

css-system make it easy for you follow your design system,

```jsx
// Just use indexes from your theme scales
<View css={{padding: 1, fontSize: 2}} />

// Use strings fro absolute value
<View css={{padding: '10px'}} />

// Colors are from the colors scale
<View css={{backgroundColor: 'primary'}} />

```

## Property aliases

Reference commonly used properties by their alias

```jsx
// Here p stands for padding, m for margin & bg for backgroundColor
<View css={{p: 1, m: "auto", bg: "accent"}} />

// Some aliases map to multiple properties
<View css={{px: 1, my: 2}} />
```

## Responsive style props

Set responsive properties with a shorthand object syntax.

```jsx
// _ means from 0px to the next defined breakpoint, here m
<View css={{p: {_: 2, , m: 4}}} />
```

## Relative selectors props

You can create your own selectors by referencing the component with `&`.

```jsx
<View css={{bg: "white", "&:hover": {bg: "black"}}} />

// It can even be responsive
<View css={{"& > * + *": {mt: {_: 2, m: 3}}}} />
```

## Global styles & keyframes

```jsx
import {useGlobalCss, useKeyFrames} from "css-system"

const App = () => {
  const fadeIn = useKeyFrames({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  })

  useGlobalCss({
    body: {
      animation: `500ms ${fadeIn} both`,
    },
    "*, *:before, *:after": {
      boxSizing: "border-box",
    },
  })

  return <div>Hello world !</div>
}
```

## Gatsby support

See [gatsby-plugin-css-system](https://github.com/css-system/gatsby-plugin-css-system)

## Further Reading

- [TWO STEPS FORWARD, ONE STEP BACK](https://jxnblk.com/blog/two-steps-forward/)

## Built with css-system

- [Amstangram](https://amstangr.am)

[MIT License](LICENSE.md)
