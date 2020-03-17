import {
  ServerStyleSheetManager,
  StyleSheetManagerContext,
} from "@css-system/use-css"
import fs from "fs"
import path from "path"
import React from "react"
import ReactDOMServer from "react-dom/server"
import App from "../src/App"

export const renderer = (req, res, next) => {
  const stylesheetManager = new ServerStyleSheetManager()

  const app = ReactDOMServer.renderToString(
    <StyleSheetManagerContext.Provider value={stylesheetManager}>
      <App />
    </StyleSheetManagerContext.Provider>
  )

  const html = fs
    .readFileSync(path.join(__dirname, "..", "build", "index.html"), "utf8")
    .replace("__STYLE__", stylesheetManager.getStyleTags())
    .replace("__ROOT__", app)

  return res.send(html)
}
