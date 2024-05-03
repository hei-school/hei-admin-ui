export const mapToChoices = (
  entries: Object,
  key1: string = "value",
  key2: string = "label"
) => {
  return Object.entries(entries).map(([val1, val2]) => ({
    [key1]: val1,
    [key2]: val2,
  }));
};
