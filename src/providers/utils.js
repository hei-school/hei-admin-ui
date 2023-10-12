// the data given by the api shouldn't respect camelCase, so we use this

const stringToCamelCase = str => {
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''))
}

export const toCamelCaseJSON = input => {
  if (!input) return input

  if (Array.isArray(input)) {
    return input.map(toCamelCaseJSON)
  }

  return Object.entries(input).reduce((prev, [key, val]) => {
    return {
      ...prev,
      [stringToCamelCase(key)]: val
    }
  }, {})
}
