import {FC} from "react";
import {Box, Typography} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import emptyImg from "@/assets/Empty_img.png";

export const EmptyList: FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    width="100%"
  >
    <img src={emptyImg} alt="empty image" />
    <Typography
      variant="h5"
      sx={{
        color: PALETTE_COLORS.primary,
      }}
    >
      La liste est vide.
    </Typography>
    <Typography variant="body1">Veuillez ajouter des éléments</Typography>
  </Box>
);
