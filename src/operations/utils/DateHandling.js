import {DateField} from "react-admin";
import {Typography} from "@mui/material";

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

export const CustomDateField = ({source, label, showTime, ...props}) => {
  return (
    <DateField
      source={source}
      label={label}
      locales="fr-FR"
      options={showTime ? {...DATE_OPTIONS, TIME_OPTIONS} : DATE_OPTIONS}
      {...props}
    />
  );
};

export function BirthDatePlace({
  birthdate,
  birthplace,
  emptyText,
  sx = {},
  ...rest
}) {
  if (!birthdate) return emptyText;

  const localBirthplace = new Date(birthdate).toLocaleDateString(
    "fr-FR",
    DATE_OPTIONS
  );

  return (
    <Typography sx={sx} {...rest}>
      {localBirthplace}
      {birthplace && ` à ${birthplace}`}
    </Typography>
  );
}

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
