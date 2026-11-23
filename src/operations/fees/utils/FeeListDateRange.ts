export const toDateInput = (iso: string | Date | null | undefined): string => {
  if (!iso) return "";
  const date = iso instanceof Date ? iso : new Date(iso);
  return date.toISOString().slice(0, DATE_INPUT_LENGTH);
};

const DATE_INPUT_LENGTH = "AAAA-MM-JJ".length;

export const buildDayDateRange = (
  dateInputFrom: string,
  dateInputTo: string
): {listDateFrom: string; listDateTo: string} => ({
  listDateFrom: startOfDay(dateInputFrom).toISOString(),
  listDateTo: endOfDay(dateInputTo).toISOString(),
});

const startOfDay = (dateInput: string): Date =>
  new Date(`${dateInput}T00:00:00.000Z`);

const endOfDay = (dateInput: string): Date => {
  const date = new Date(`${dateInput}T00:00:00.000Z`);
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

export const getDefaultListDateRange = (): {
  listDateFrom: Date;
  listDateTo: Date;
} => {
  const now = new Date();
  return {
    listDateFrom: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    listDateTo: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
};

export type DateRangeError = "INCOMPLETE" | "REVERSED";

export const getDateRangeError = (
  dateInputFrom: string,
  dateInputTo: string
): DateRangeError | undefined => {
  if (!dateInputFrom || !dateInputTo) return "INCOMPLETE";
  if (dateInputTo < dateInputFrom) return "REVERSED";
  return undefined;
};
