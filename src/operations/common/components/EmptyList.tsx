import EmptyImg from "@/assets/Empty_img_3D.png";
import {PALETTE_COLORS} from "@/haTheme";
import {Box, Typography, useTheme} from "@mui/material";
import {keyframes} from "@mui/system";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

export const EmptyList3D = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "90%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        borderRadius: 4,
        padding: 4,
      }}
    >
      <Box
        component="img"
        src={EmptyImg}
        sx={{
          "height": "65%",
          "maxWidth": "100%",
          "animation": `${float} 3s ease-in-out infinite`,
          "filter": "drop-shadow(0 10px 15px rgba(0,0,0,0.2))",
          "transition": "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: PALETTE_COLORS.primary,
          textAlign: "center",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Il n'y a pas de données à afficher
      </Typography>
    </Box>
  );
};
