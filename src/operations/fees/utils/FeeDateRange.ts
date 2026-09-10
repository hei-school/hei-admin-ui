export const toMonthInput = (iso: unknown): string => {
  if (!iso) return "";
  const isoString = iso instanceof Date ? iso.toISOString() : String(iso);
  return isoString.slice(0, MONTH_INPUT_LENGTH);
};

const MONTH_INPUT_LENGTH = "AAAA-MM".length;

export const buildDateRange = (
  monthInputFrom: string,
  monthInputTo: string
): {monthFrom: string; monthTo: string} => ({
  monthFrom: startOfMonth(monthInputFrom).toISOString(),
  monthTo: endOfMonth(monthInputTo).toISOString(),
});

const startOfMonth = (monthInput: string): Date =>
  new Date(`${monthInput}-01T00:00:00.000Z`);

const endOfMonth = (monthInput: string): Date => {
  const [year, month] = monthInput.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, -1));
  lastDay.setUTCHours(23, 59, 59, 999);
  return lastDay;
};

export const toCurrentMonthInput = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

export type MonthRangeError = "INCOMPLETE" | "REVERSED" | "IN_FUTURE";

export const getMonthRangeError = (
  monthInputFrom: string,
  monthInputTo: string
): MonthRangeError | undefined => {
  if (!monthInputFrom || !monthInputTo) return "INCOMPLETE";
  if (monthInputTo < monthInputFrom) return "REVERSED";
  if (monthInputTo > toCurrentMonthInput()) return "IN_FUTURE";
  return undefined;
};
