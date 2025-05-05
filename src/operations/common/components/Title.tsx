import {PALETTE_COLORS} from "@/haTheme";
import {Typography, useMediaQuery} from "@mui/material";
import {FC} from "react";

export const Title: FC<{label: string}> = ({label}) => {
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <Typography
      color={PALETTE_COLORS.yellow}
      fontWeight="bold"
      width="100%"
      borderBottom={`1px solid ${PALETTE_COLORS.grey}`}
      fontSize={isLarge ? "1.5rem" : "0.9rem"}
    >
      {label}
    </Typography>
  );
};
