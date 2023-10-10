// the data given by the api shouldn't respect camelCase, so we use this
import * as db from 'mime-db'

const toCamelCase = str => {
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''))
}
export const toCamelCaseJSON = obj => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCaseJSON(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toCamelCase(key)]: toCamelCaseJSON(obj[key])
      }),
      {}
    )
  }
  return obj
}
