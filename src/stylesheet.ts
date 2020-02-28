import {createContext} from "react"

class ClientStyleSheet {
  sheet: CSSStyleSheet
  createdClassNames: Record<string, true> = {}

  constructor() {
    const element = document.createElement("style")

    document.head.appendChild(element)

    this.sheet = element.sheet as CSSStyleSheet
  }

  insertRule(rule: string) {
    this.sheet.insertRule(rule, this.sheet.cssRules.length)
  }
}

class ServerStyleSheet {
  rules: string[] = []
  createdClassNames: Record<string, true> = {}

  insertRule(rule: string) {
    this.rules.push(rule)
  }
}

const isBrowser = typeof document !== "undefined"

const StyleSheetContext = createContext(
  isBrowser ? new ClientStyleSheet() : new ServerStyleSheet()
)

export {ServerStyleSheet, ClientStyleSheet, StyleSheetContext}
