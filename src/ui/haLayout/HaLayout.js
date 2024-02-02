import { AppLocationContext } from "@react-admin/ra-navigation";
import { styled, ThemeProvider } from "@mui/styles";
import { Box, useMediaQuery } from "@mui/material";
import { HaMenu } from "./menu/utils/";
import { HaAppBar } from "./appBar";
import { mainTheme } from "../../haTheme";
import { PALETTE_COLORS } from "../constants/palette";

const HaLayoutStyled = styled("div")({
  minHeight: "100vh",
  position: "relative",
  backgroundColor: "#f0f0f0",
  width: "100%",
});

export function BackgroundBoxStyle({ sx = {} }) {
  return (
    <Box sx={{
      width: '220px',
      height: '300px',
      position: "absolute",
      bgcolor: PALETTE_COLORS.yellow,
      zIndex: 0,
      ...sx
    }}
    />
  )
}

export function HaLayout({ children }) {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <AppLocationContext>
      <ThemeProvider theme={mainTheme}>
        <HaLayoutStyled>
          <HaAppBar />
          <HaMenu />
          <Box
            sx={{
              ml: isSmall ? 0 : "250px",
              width: isSmall ? "100%" : "calc(100% - 250px)",
              boxSizing: "border-box",
              transition: "all .3s linear",
              px: 1,
              position: "relative"
            }}
            component="div"
            id="main-content"
          >
            <BackgroundBoxStyle sx={{ top: "-70px", left: "-50px", transform: "rotate(-15deg)" }} />
            {children}
          </Box>
        </HaLayoutStyled>
        <BackgroundBoxStyle sx={{ bottom: "-70px", position:"fixed", right: "-50px", transform: "rotate(-100deg)" }} />
      </ThemeProvider>
    </AppLocationContext>
  );
}
