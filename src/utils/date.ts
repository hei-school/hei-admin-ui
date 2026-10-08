import {EMPTY_TEXT} from "@/ui/constants";

type DateInput = string | number | Date;

const toDate = (date?: DateInput) => new Date(date ?? Number.NaN);

export const DATE_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

export const TIME_OPTIONS = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

export const DATETIME_OPTIONS = {
  ...DATE_OPTIONS,
  ...TIME_OPTIONS,
} as const satisfies Intl.DateTimeFormatOptions;

export const formatDate = (dateIso?: DateInput | null, showTime = true) => {
  if (!dateIso) return EMPTY_TEXT;
  const OPTIONS = showTime ? DATETIME_OPTIONS : DATE_OPTIONS;
  return new Date(dateIso).toLocaleDateString("fr-FR", OPTIONS);
};

export const getTime = (dateIso?: DateInput) => {
  const date = toDate(dateIso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export const isSameDay = (startDate: DateInput, endDate: DateInput) => {
  return new Date(startDate).getDate() == new Date(endDate).getDate();
};

export const toISO = (stringDate?: DateInput) => {
  return toDate(stringDate).toISOString();
};

export const toUTC = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

export const get27thOfMonth = (year: number, month: number) => {
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

declare global {
  interface Window {
    getCurrentWeekRange?: typeof getCurrentWeekRange;
  }
}

if (typeof window !== "undefined") {
  window.getCurrentWeekRange = getCurrentWeekRange;
}
