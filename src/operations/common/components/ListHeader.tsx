import {PALETTE_COLORS} from "@/haTheme";
import {Box, Typography} from "@mui/material";
import {FC} from "react";
import {CreateButton} from "react-admin";

interface ListHeaderProps {
  title: string;
}
export const ListHeader: FC<ListHeaderProps> = ({title}) => {
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
          <Typography variant="h6" fontWeight="bolder">
            {title}
          </Typography>
        </Box>
        <Box>
          <CreateButton
            size="medium"
            sx={{
              "bgcolor": PALETTE_COLORS.primary,
              "color": PALETTE_COLORS.white,
              "transition": "all .5s linear",
              "opacity": 0.9,
              "&:hover": {
                bgcolor: PALETTE_COLORS.primary,
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr 1fr 1fr"
        columnGap="5px"
        mx="auto"
        width="90%"
      >
        <div
          style={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            maxWidth: "250px",
            height: "175px",
            margin: "-80px 0px 5px 5px",
            borderRadius: "16px",
          }}
        >
          statistique
        </div>
        <div
          style={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            maxWidth: "250px",
            height: "175px",
            margin: "-80px 0px 5px 5px",
            borderRadius: "16px",
          }}
        >
          statistique
        </div>
        <div
          style={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            maxWidth: "250px",
            height: "175px",
            margin: "-80px 0px 5px 5px",
            borderRadius: "16px",
          }}
        >
          statistique
        </div>
        <div
          style={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            maxWidth: "250px",
            height: "175px",
            margin: "-80px 0px 5px 5px",
            borderRadius: "16px",
          }}
        >
          statistique
        </div>
      </Box>
    </Box>
  );
};
