export const DATE_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TIME_OPTIONS = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export const DATETIME_OPTIONS = {
  ...DATE_OPTIONS,
  ...TIME_OPTIONS,
};

export function formatDate(dateIso, showTime = true) {
  const OPTIONS = showTime ? DATETIME_OPTIONS : DATE_OPTIONS;
  return new Date(dateIso).toLocaleDateString("fr-FR", OPTIONS);
}

export const toISO = (stringDate) => {
  return new Date(stringDate).toISOString();
};

export const toUTC = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

export const getEndOfMonth = (year, month) => {
  return toUTC(new Date(year, month + 1, 0));
};

//export const TurnsYearMonthDayIntoDate = ({year, month, day}) => {
//   return new Date(year, month - 1, day).toISOString();
// };
