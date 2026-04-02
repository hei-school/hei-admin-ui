import {Box} from "@mui/material";
import {FC, ReactElement, ReactNode} from "react";

export interface CardFeesContent {
  title: string;
  icon: ReactElement;
  L1?: number | string;
  L2?: number | string;
  L3?: number | string;
  R?: number | string;
  A?: number | string;
  mensual?: number | string;
  annual?: number | string;
  mobile_money?: number | string;
  bank_fees?: number | string;
}

interface ListHeaderProps {
  title: string | ReactNode;
  action?: ReactNode;
  cardContents: Array<CardFeesContent>;
}

export const FeesStatsHeader: FC<ListHeaderProps> = ({title, action}) => {
  return (
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
        bgcolor="#f1C16B"
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
          background: `linear-gradient(135deg, #001948 0%, #001B4E 20%, #003CAE 100%)`,
          borderRadius: "0 0 16px 16px",
          padding: "16px",
          width: "100%",
        }}
      >
        {action}
      </Box>
    </Box>
  );
};
