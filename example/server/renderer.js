import {ServerStyleSheet, StyleSheetContext} from "@css-system/use-css"
import fs from "fs"
import path from "path"
import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "../src/App"

export const renderer = (req, res, next) => {
  const stylesheet = new ServerStyleSheet()

  const app = ReactDOMServer.renderToString(
    <StyleSheetContext.Provider value={stylesheet}>
      <App />
    </StyleSheetContext.Provider>
  )

  const styleTag = `<style>${stylesheet.rules.join(" ")}</style>`

  const html = fs
    .readFileSync(path.join(__dirname, "..", "build", "index.html"), "utf8")
    .replace("__STYLE__", styleTag)
    .replace("__ROOT__", app)

  return res.send(html)
}
