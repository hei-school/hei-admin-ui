import {DATE_OPTIONS} from "@/utils/date";
import {Typography, useMediaQuery} from "@mui/material";

interface HaDateFieldProps {
  value?: Date | string;
}

export const HaDateField = ({value, ...props}: Readonly<HaDateFieldProps>) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <Typography {...props} variant={isLarge ? "body2" : "caption"}>
      {value
        ? new Date(value).toLocaleString("fr-FR", DATE_OPTIONS)
        : "Non-défini.e"}
    </Typography>
  );
};
