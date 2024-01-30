export const getEndOfMonth = (year, month) => {
  return new Date(year, month + 1, 1);
};
