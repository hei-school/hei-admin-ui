import {formatDate} from "@/utils/date";
import {Typography, TypographyProps, useMediaQuery} from "@mui/material";
import {ReactNode} from "react";

type BirthDateFieldProps = TypographyProps & {
  birthdate?: string;
  birthplace?: string;
  emptyText?: ReactNode;
};

export const BirthDateField = ({
  birthdate,
  birthplace,
  emptyText,
  ...typographyProps
}: Readonly<BirthDateFieldProps>) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  if (!birthdate) return emptyText;

  const localBirthplace = formatDate(birthdate, false);

  return (
    <Typography {...typographyProps} variant={isLarge ? "body2" : "caption"}>
      {localBirthplace}
      {birthplace && ` à ${birthplace}`}
    </Typography>
  );
};
