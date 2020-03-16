import {createContext} from "react"

const GLOBAL_ID = "global"
const ID_ATTRIBUTE = "data-css-id"
const CREATED_CLASS_NAMES_ATTRIBUTES = "data-css-class-names"
const CREATED_CLASS_NAMES_SEPARATOR = " "

interface StyleSheet {
  insertRule(rule: string): void
}

interface StyleSheetManager {
  getGlobalStyleSheet(): StyleSheet
  createStyleSheet(id: string): StyleSheet
  removeStyleSheet(id: string): void
}

class ClientStyleSheet implements StyleSheet {
  sheet: CSSStyleSheet
  createdClassNames: Record<string, true> = {}

  constructor(id: string) {
    let element = document.querySelector<HTMLStyleElement>(
      `style[${ID_ATTRIBUTE}="${id}"]`
    )

    if (element === null) {
      element = document.createElement("style")
      element.setAttribute(ID_ATTRIBUTE, id)
      document.head.appendChild(element)
    } else {
      const createdClassNames = element.getAttribute(
        CREATED_CLASS_NAMES_ATTRIBUTES
      )
      if (createdClassNames !== null) {
        createdClassNames
          .split(CREATED_CLASS_NAMES_SEPARATOR)
          .forEach(className => (this.createdClassNames[className] = true))
      }
    }

    this.sheet = element.sheet as CSSStyleSheet
  }

  insertRule(rule: string) {
    this.sheet.insertRule(rule, this.sheet.cssRules.length)
  }
}

class ClientStyleSheetManager implements StyleSheetManager {
  styleSheets: Record<string, ClientStyleSheet> = {
    [GLOBAL_ID]: new ClientStyleSheet(GLOBAL_ID),
  }

  getGlobalStyleSheet() {
    return this.styleSheets[GLOBAL_ID]
  }

  createStyleSheet(id: string) {
    this.styleSheets[id] = new ClientStyleSheet(id)
    return this.styleSheets[id]
  }

  removeStyleSheet(id: string) {
    delete this.styleSheets[id]
  }
}

class ServerStyleSheet implements StyleSheet {
  id: string
  rules: string[] = []
  createdClassNames: Record<string, true> = {}

  constructor(id: string) {
    this.id = id
  }

  insertRule(rule: string) {
    this.rules.push(rule)
  }

  getStyleTag() {
    return `<style ${ID_ATTRIBUTE}="${
      this.id
    }" ${CREATED_CLASS_NAMES_ATTRIBUTES}="${Object.keys(
      this.createdClassNames
    ).join(CREATED_CLASS_NAMES_SEPARATOR)}">${this.rules.join("\n")}</style>`
  }
}

class ServerStyleSheetManager implements StyleSheetManager {
  styleSheets: Record<string, ServerStyleSheet> = {
    [GLOBAL_ID]: new ServerStyleSheet(GLOBAL_ID),
  }

  getGlobalStyleSheet() {
    return this.styleSheets[GLOBAL_ID]
  }

  createStyleSheet(id: string) {
    this.styleSheets[id] = new ServerStyleSheet(id)
    return this.styleSheets[id]
  }

  removeStyleSheet(id: string) {
    delete this.styleSheets[id]
  }

  getStyleTags() {
    return Object.values(this.styleSheets)
      .map(styleSheet => styleSheet.getStyleTag())
      .join("\n")
  }
}

const isBrowser = typeof document !== "undefined"

const StyleSheetManagerContext = createContext(
  isBrowser ? new ClientStyleSheetManager() : new ServerStyleSheetManager()
)

export {
  ServerStyleSheetManager,
  ClientStyleSheetManager,
  StyleSheetManagerContext,
}
