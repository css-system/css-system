import {unitlessCssProperties} from "./constants"

export const get = (obj: Object, path: string | number, def?: any) => {
  let result = obj
  const keys = typeof path === "string" ? path.split(".") : [path]
  for (const key of keys) {
    result = result ? result[key] : undefined
  }
  return result === undefined ? def : result
}

export const positiveOrNegative = (scale, value) => {
  if (typeof value !== "number" || value >= 0) {
    return get(scale, value, value)
  }
  const absolute = Math.abs(value)
  const n = get(scale, absolute, absolute)
  if (typeof n === "string") {
    return "-" + n
  }

  return n * -1
}

export const transforms = [
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginX",
  "marginY",
  "top",
  "bottom",
  "left",
  "right",
].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: positiveOrNegative,
  }),
  {}
)

export const addUnitIfNeeded = (name: string, value: unknown): string => {
  if (value == null || typeof value === "boolean" || value === "") {
    return ""
  }

  if (
    typeof value === "number" &&
    value !== 0 &&
    !(name in unitlessCssProperties)
  ) {
    return `${value}px` // Presumes implicit 'px' suffix for unitless numbers
  }

  return String(value).trim()
}

export const camelCaseToSnakeCase = (prop: string): string =>
  prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
