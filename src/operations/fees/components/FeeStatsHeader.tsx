import {Box} from "@mui/material";
import {ReactNode} from "react";
import {ACCENT_COLOR, HEADER_GRADIENT} from "./StyleFeeStat";

type FeesStatsHeaderProps = {
  title: ReactNode;
  action?: ReactNode;
};

export const FeesStatsHeader = ({title, action}: FeesStatsHeaderProps) => (
  <Box
    width="100%"
    mx="auto"
    display="flex"
    flexDirection="column"
    position="relative"
    mb="32px"
    sx={{backgroundColor: "transparent"}}
  >
    <Box
      bgcolor={ACCENT_COLOR}
      display="flex"
      flexDirection="column"
      px={{xs: 2, md: 3}}
      py={2}
      width="100%"
      borderRadius="16px 16px 0px 0px"
      gap={1.5}
    >
      {title}
    </Box>
    <Box
      sx={{
        background: HEADER_GRADIENT,
        borderRadius: "0 0 16px 16px",
        padding: "16px",
        width: "100%",
      }}
    >
      {action}
    </Box>
  </Box>
);
