export function getObjValue(obj: {[key: string]: any}, path: string) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== "undefined" ? acc[key] : undefined),
      {...obj}
    );
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export function formatDate(dateIso: any) {
  if (!dateIso) {
    return;
  }

  const date = new Date(dateIso);
  const formatter = new Intl.DateTimeFormat("fr-FR", dateOptions);
  const dateFormater = formatter.format(date);
  return dateFormater.at(0)?.toLocaleUpperCase() + dateFormater.slice(1);
}
