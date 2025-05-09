import {format} from "date-fns-tz";

export const MADAGASCAR_TIMEZONE = "Africa/Nairobi";

export const formatDateToLocalTimeZone = (
  date: Date,
  timeZone: string = MADAGASCAR_TIMEZONE
) => {
  return format(date, "yyyy-MM-dd", {timeZone});
};
