import React, {Context} from "react"

class ClientStyleSheet {
  sheet: CSSStyleSheet

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
  rules: string[]

  constructor() {
    this.rules = []
  }

  insertRule(rule: string) {
    this.rules.push(rule)
  }

  getRules() {
    return this.rules
  }
}

const isBrowser = typeof document !== "undefined"

const StyleSheetContext: Context<
  ServerStyleSheet | ClientStyleSheet
> = React.createContext(
  isBrowser ? new ClientStyleSheet() : new ServerStyleSheet()
)

export {ServerStyleSheet, ClientStyleSheet, StyleSheetContext}
