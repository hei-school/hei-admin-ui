export const stringifyObj = <T>(value: T) => {
  return JSON.stringify(value);
};

if (typeof window !== "undefined") {
  // @ts-ignore
  window.stringifyObj = stringifyObj;
}
