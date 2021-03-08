import {createContext, createElement} from "react"

const GLOBAL_ID = "global"
const ID_ATTRIBUTE = "data-css-system-id"
const CREATED_IDS_ATTRIBUTE = "data-css-system-ids"
const CREATED_IDS_SEPARATOR = " "

const isDev = typeof window !== "undefined" 
  ? false 
  : process && process.env && process.env.NODE_ENV === "development"

interface StyleSheet {
  createdIds: Record<string, true>
  insertRule(rule: string): void
}

interface ClientStyleSheet extends StyleSheet {
  remove(): void
}

interface ServerStyleSheet extends StyleSheet {
  getStyleTag(): string
  getStyleComponent(): JSX.Element
}

interface StyleSheetManager {
  getGlobalStyleSheet(): StyleSheet
  createStyleSheet(id: string): StyleSheet
  removeStyleSheet(id: string): void
}

interface ServerStyleSheetManager extends StyleSheetManager {
  getStyleTags(): string
  getStyleComponents(): JSX.Element[]
}

class ClientStyleSheet implements ClientStyleSheet {
  element: HTMLStyleElement
  createdIds: Record<string, true> = {}

  constructor(id: string) {
    let element = document.querySelector<HTMLStyleElement>(
      `style[${ID_ATTRIBUTE}="${id}"]`
    )

    if (element === null) {
      element = document.createElement("style")
      element.setAttribute(ID_ATTRIBUTE, id)
      document.head.appendChild(element)
    } else {
      const createdIds = element.getAttribute(CREATED_IDS_ATTRIBUTE)
      if (createdIds !== null) {
        createdIds
          .split(CREATED_IDS_SEPARATOR)
          .forEach((id) => (this.createdIds[id] = true))
      }
    }

    this.element = element
  }

  insertRule(rule: string) {
    const sheet = this.element.sheet as CSSStyleSheet
    sheet.insertRule(rule, sheet.cssRules.length)
  }

  remove() {
    this.element.remove()
  }
}

class DevClientStyleSheet extends ClientStyleSheet {
  insertRule(rule: string) {
    this.element.textContent += rule + '\n'
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
    if (this.styleSheets[id]) {
      this.styleSheets[id].remove()
      delete this.styleSheets[id]
    }
  }
}
class DevClientStyleSheetManager extends ClientStyleSheetManager {
  styleSheets: Record<string, DevClientStyleSheet> = {
    [GLOBAL_ID]: new DevClientStyleSheet(GLOBAL_ID),
  }

  createStyleSheet(id: string) {
    this.styleSheets[id] = new DevClientStyleSheet(id)
    return this.styleSheets[id]
  }
}

class ServerStyleSheet implements StyleSheet {
  id: string
  rules: string[] = []
  createdIds: Record<string, true> = {}

  constructor(id: string) {
    this.id = id
  }

  insertRule(rule: string) {
    this.rules.push(rule)
  }

  getStyleTag() {
    return `<style ${ID_ATTRIBUTE}="${
      this.id
    }" ${CREATED_IDS_ATTRIBUTE}="${Object.keys(this.createdIds).join(
      CREATED_IDS_SEPARATOR
    )}">${this.rules.join("\n")}</style>`
  }

  getStyleComponent() {
    return createElement("style", {
      [ID_ATTRIBUTE]: this.id,
      [CREATED_IDS_ATTRIBUTE]: Object.keys(this.createdIds).join(
        CREATED_IDS_SEPARATOR
      ),
      dangerouslySetInnerHTML: {__html: this.rules.join("\n")},
    })
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
      .map((styleSheet) => styleSheet.getStyleTag())
      .join("\n")
  }

  getStyleComponents() {
    return Object.values(this.styleSheets).map((styleSheet) =>
      styleSheet.getStyleComponent()
    )
  }
}

const isBrowser = typeof document !== "undefined"

const StyleSheetManagerContext = createContext(
  isBrowser
    ? isDev
      ? new DevClientStyleSheetManager()
      : new ClientStyleSheetManager()
    : new ServerStyleSheetManager()
)

export {
  ServerStyleSheetManager,
  ClientStyleSheetManager,
  StyleSheetManagerContext,
}
