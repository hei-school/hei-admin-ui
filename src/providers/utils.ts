// the data given by the api shouldn't respect camelCase, so we use this
const stringToCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

export const toCamelCaseJSON = (input: unknown): unknown => {
  if (!input) return input;

  if (Array.isArray(input)) {
    return input.map(toCamelCaseJSON);
  }

  return Object.entries(input).reduce<Record<string, unknown>>(
    (prev, [key, val]) => {
      return {
        ...prev,
        [stringToCamelCase(key)]: val,
      };
    },
    {}
  );
};

interface MonthFilter {
  monthFrom?: Date;
  monthTo?: Date;
}

export const getMonthFilters = (filter: MonthFilter = {}) => {
  const now = new Date();
  const monthFrom =
    filter.monthFrom ?? new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTo =
    filter.monthTo ?? new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {monthFrom, monthTo};
};
