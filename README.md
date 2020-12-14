# css-system

[![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/css-system.svg?style=flat-square
[npm]: https://www.npmjs.org/package/css-system

React hooks and helpers for building versatile design primitives.

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

You can run the example todo list app by cloning this project and running `yarn example:start` at the project root.

## Usage

```js
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

export const Row = extendPrimitive(View, {
  flexDirection: "column",
  alignItems: "baseline",
})
```

```jsx
// Easily create great ui using it
export const App = () => (
  <View css={{color: "primary", fontSize: 4}}>Hello world !</View>
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
<View css={{p: {_: 2, m: 4}}} />
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
import {useGlobalCss, useKeyframes} from "css-system"

const App = () => {
  const fadeIn = useKeyframes({
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

## Caveats

`useCss`, `useGlobalCss` and `useKeyframes` only compute styles on first render or on theme change. This is what allow the library to consume anonymous objects without performance overhead.

If you want dynamic styles, you can pass a dependency array as a second argument to `useCss`, `useGlobalCss` and `useKeyframes`.

```jsx
// Here we pass the `deps` prop to useCss as a second argument
const View = ({as: Component = "div", css, deps, ...props}) => {
  const className = useCss(
    {
      display: "flex",
      minWidth: 0,
      minHeight: 0,
      flex: "none",
      alignItems: "stretch",
      flexDirection: "column",
      justifyContent: "flex-start",
      ...css,
    },
    deps
  )

  return <Component className={className} {...props} />
}
```

Components created with `createPrimitive` or `extendPrimitive` already implements this behavior.

```jsx
// Elsewhere in the application
<View css={{bg: selected ? "primary" : "neutral"}} deps={[selected]} />
```

Do not overuse this pattern, it is only recommended when all possible property values are known in advance and theme dependant. If it's not the case, simply use the native `style` prop. There is nothing wrong with it.

```jsx
<View
  css={{position: "fixed"}}
  style={{top: mouseEvent.clientY, left: mouseEvent.clientX}}
/>
```

## Gatsby support

See [gatsby-plugin-css-system](https://github.com/css-system/gatsby-plugin-css-system)

## Further Reading

- [TWO STEPS FORWARD, ONE STEP BACK](https://jxnblk.com/blog/two-steps-forward/)

## Built with css-system

- [https://amstangr.am](https://amstangr.am)
- [https://cedricdelpoux.fr/](https://cedricdelpoux.fr/)

[MIT License](LICENSE.md)
