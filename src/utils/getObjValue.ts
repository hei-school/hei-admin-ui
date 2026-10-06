declare global {
  interface Window {
    getObjValue?: typeof getObjValue;
  }
}

const readKey = (source: unknown, key: string): unknown => {
  if (source === null || source === undefined) return undefined;
  const wrapped: object = Object(source);
  return Reflect.get(wrapped, key);
};

/**
 * Retrieves the value of a nested property in an object using a specified path.
 *
 * @param {Object} obj - The source object from which to retrieve the value.
 * @param {string} path - The property path to retrieve, separated by dots (e.g., 'prop1.prop2.prop3').
 * @returns {*} The value of the specified property or undefined if it doesn't exist.
 */
export const getObjValue = (obj: object, path: string): unknown => {
  return path.split(".").reduce<unknown>(readKey, {...obj});
};

if (typeof window !== "undefined") {
  window.getObjValue = getObjValue;
}
