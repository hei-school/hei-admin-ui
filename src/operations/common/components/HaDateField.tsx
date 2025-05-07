import {DATE_OPTIONS} from "@/utils/date";
import {Typography, useMediaQuery} from "@mui/material";
import {FC} from "react";

export const HaDateField: FC<{value?: Date | string}> = ({value, ...props}) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <Typography {...props} variant={isLarge ? "body2" : "caption"}>
      {value
        ? new Date(value).toLocaleString("fr-FR", DATE_OPTIONS as any)
        : "Non-défini.e"}
    </Typography>
  );
};
