/**
 * Retrieves the value of a nested property in an object using a specified path.
 *
 * @param {Object} obj - The source object from which to retrieve the value.
 * @param {string} path - The property path to retrieve, separated by dots (e.g., 'prop1.prop2.prop3').
 * @returns {*} The value of the specified property or undefined if it doesn't exist.
 */
export function getObjValue(obj: Record<string, any>, path: string): unknown {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      {...obj}
    );
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.getObjValue = getObjValue;
}
