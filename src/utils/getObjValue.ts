type Obj = {[key: string]: any};

/**
 * Retrieves the value of a nested property in an object using a specified path.
 *
 * @param {Obj} obj - The source object from which to retrieve the value.
 * @param {string} path - The property path to retrieve, separated by dots (e.g., 'prop1.prop2.prop3').
 * @returns {*} The value of the specified property or undefined if it doesn't exist.
 */
export function getObjValue(obj: Obj, path: string): any {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      {...obj}
    );
}
