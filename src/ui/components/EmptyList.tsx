import emptyImg from "@/assets/Empty_img.png";
import {PALETTE_COLORS} from "@/haTheme";
import {Box, Typography} from "@mui/material";

export const EmptyList = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    width="70vw"
  >
    <img src={emptyImg} alt="" />
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
