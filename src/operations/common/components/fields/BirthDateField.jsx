import {Typography} from "@mui/material";
import {formatDate} from "../../../../utils/date";

export function BirthDateField({
  birthdate,
  birthplace,
  emptyText,
  ...typographyProps
}) {
  if (!birthdate) return emptyText;

  const localBirthplace = formatDate(birthdate, false);

  return (
    <Typography {...typographyProps}>
      {localBirthplace}
      {birthplace && ` à ${birthplace}`}
    </Typography>
  );
}
