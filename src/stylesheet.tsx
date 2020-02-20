import React, {Context} from "react"

const StyleSheetContext: Context<ServerStyleSheet> = React.createContext(null)

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

export {ServerStyleSheet, ClientStyleSheet, StyleSheetContext}
