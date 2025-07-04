import {EMPTY_TEXT} from "@/ui/constants";

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
  if (!dateIso) return EMPTY_TEXT;
  const OPTIONS = showTime ? DATETIME_OPTIONS : DATE_OPTIONS;
  return new Date(dateIso).toLocaleDateString("fr-FR", OPTIONS);
}

export function getTime(dateIso) {
  const date = new Date(dateIso);
  return `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}`;
}

export function isSameDay(startDate, endDate) {
  return new Date(startDate).getDate() == new Date(endDate).getDate();
}

export const toISO = (stringDate) => {
  return new Date(stringDate).toISOString();
};

export const toUTC = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

export const get27thOfMonth = (year, month) => {
  return new Date(year, month, 27);
};

//export const TurnsYearMonthDayIntoDate = ({year, month, day}) => {
//   return new Date(year, month - 1, day).toISOString();
// };

export const getCurrentWeekRange = (currentDate = new Date()) => {
  const dayOfWeek = currentDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  saturday.setHours(0, 0, 0, 0);

  return {monday, saturday};
};

if (typeof window !== "undefined") {
  window.getCurrentWeekRange = getCurrentWeekRange;
}
