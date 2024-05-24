import {FC, ReactNode} from "react";
import {Box, Typography, Avatar, useMediaQuery} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";

export interface CardContent {
  title: string;
  total: number;
  icon: string;
}

interface ListHeaderProps {
  title: string;
  action: ReactNode;
  cardContents: Array<CardContent>;
}

export const ListHeader: FC<ListHeaderProps> = ({
  title,
  action,
  cardContents,
}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");

  return (
    <Box
      width="80%"
      mx="auto"
      marginTop={3}
      display="flex"
      flexDirection="column"
    >
      <Box
        bgcolor={PALETTE_COLORS.yellow}
        display="flex"
        justifyContent="space-between"
        px={5}
        paddingTop={5}
        borderRadius="20px 20px 0px 0px"
        paddingBottom={15}
      >
        <Box>
          <Typography variant="h5" fontWeight="bolder">
            {title}
          </Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${isSmall ? "auto-fill" : cardContents.length}, minmax(11.25rem, 1fr))`}
        gridTemplateRows="auto"
        width="90%"
        m="auto"
        rowGap="100px"
      >
        {cardContents.map((card) => (
          <Box
            key={card.title}
            sx={{
              backgroundColor: PALETTE_COLORS.primary,
              color: PALETTE_COLORS.white,
              maxWidth: "200px",
              height: "150px",
              m: "-80px 5px 5px 5px",
              borderRadius: "10px",
            }}
          >
            <Box
              display="flex"
              paddingTop={2}
              px={3}
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight="bolder">
                {card.title ?? ""}
              </Typography>
              <Avatar
                sx={{
                  height: "40px",
                  width: "40px",
                  color: PALETTE_COLORS.yellow,
                  bgcolor: "#263B63",
                  borderRadius: "7px",
                }}
                variant="square"
              >
                {card.icon}
              </Avatar>
            </Box>
            <Box display="flex" flexDirection="column" px={3}>
              <Typography variant="h4" fontWeight="bolder">
                {card.total}
              </Typography>
              <Typography variant="h6">Au total</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
