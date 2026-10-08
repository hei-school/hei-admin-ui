export const stringifyObj = <T>(value: T) => {
  return JSON.stringify(value);
};

declare global {
  interface Window {
    stringifyObj?: typeof stringifyObj;
  }
}

if (typeof window !== "undefined") {
  window.stringifyObj = stringifyObj;
}
