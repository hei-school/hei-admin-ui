export const stringifyObj = (obj: unknown): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
};
