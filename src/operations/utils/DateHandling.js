import {DateField} from "react-admin";

export const CustomDateField = ({source, label, showTime, ...props}) => {
  let optionsObject = {year: "numeric", month: "long", day: "numeric"};
  showTime &&
    Object.assign(optionsObject, {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  return (
    <DateField
      source={source}
      label={label}
      locales="fr-FR"
      options={optionsObject}
      {...props}
    />
  );
};

export const turnStringIntoDate = (stringDate) => {
  return new Date(stringDate).toISOString();
};

export const TurnsYearMonthDayIntoDate = ({year, month, day}) => {
  return new Date(year, month - 1, day).toISOString();
};

export const toUTC = (date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};
