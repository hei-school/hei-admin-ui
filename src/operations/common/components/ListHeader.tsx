import {FC, ReactNode} from "react";
import {Box, Typography, Avatar, useMediaQuery} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";

export interface CardContent {
  title: string;
  total: number;
  icon: string;
  statDetails: Array<{
    icon: string;
    total: number;
  }>;
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
      width="calc(100% - 20px)"
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
              backgroundColor: PALETTE_COLORS.white,
              color: PALETTE_COLORS.primary,
              maxWidth: "210px",
              height: "150px",
              m: "-80px 5px 5px 5px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              padding: "10px",
              border: "3px solid",
              borderColor: PALETTE_COLORS.primary,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              gap={2}
            >
              <Avatar
                sx={{
                  height: "40px",
                  width: "40px",
                  color: PALETTE_COLORS,
                  bgcolor: "#263B63",
                  borderRadius: "7px",
                }}
                variant="square"
              >
                {card.icon}
              </Avatar>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Typography sx={{fontSize: "1.3rem"}}>{card.title}</Typography>
                <Typography sx={{fontSize: "1rem"}}>{card.total}</Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
              textAlign="center"
            >
              {/* <Box>
                <CheckCircle color="success" />
                <Typography>{card.total}</Typography>
              </Box>
              <Box>
                <PersonRemove color="warning" />
                <Typography>{card.total}</Typography>
              </Box>
              <Box>
                <PersonOff color="error" />
                <Typography>{card.total}</Typography>
              </Box> */}
              {card?.statDetails?.map(({icon, total}) => (
                <Box>
                  {icon}
                  <Typography>{total}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
