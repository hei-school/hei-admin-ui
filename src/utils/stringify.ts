export const stringifyObj = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
};
