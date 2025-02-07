import {formatDate} from "@/utils/date";
import {Typography, useMediaQuery} from "@mui/material";

export function BirthDateField({
  birthdate,
  birthplace,
  emptyText,
  ...typographyProps
}) {
  const isLarge = useMediaQuery("(min-width:1700px)");
  if (!birthdate) return emptyText;

  const localBirthplace = formatDate(birthdate, false);

  return (
    <Typography {...typographyProps} variant={isLarge ? "body2" : "caption"}>
      {localBirthplace}
      {birthplace && ` à ${birthplace}`}
    </Typography>
  );
}
