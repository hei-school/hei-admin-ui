import { Typography } from "@mui/material"
import { formatDate } from "../../../../utils";

export function BirthDateField({
  birthdate,
  birthplace,
  emptyText,
  sx = {},
  ...typographyProps
}) {
  
  if (!birthdate) return emptyText;
  
  const localBirthplace = formatDate(birthdate, false);

  return (
    <Typography sx={sx} {...typographyProps}>
      {localBirthplace}
      {birthplace && ` à ${birthplace}`}
    </Typography>
  );
}
