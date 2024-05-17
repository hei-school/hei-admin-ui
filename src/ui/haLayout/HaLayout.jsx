import {AppLocationContext} from "@react-admin/ra-navigation";
import {Box, styled, ThemeProvider, useMediaQuery} from "@mui/material";
import {HaMenu} from "./menu/utils/";
import {HaAppBar} from "./appBar";
import {mainTheme, PALETTE_COLORS} from "../../haTheme";

const HaLayoutStyled = styled("div")({
  minHeight: "100vh",
  position: "relative",
  backgroundColor: PALETTE_COLORS.bgGrey,
  width: "100%",
});

export function HaLayout({children}) {
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
              position: "relative",
            }}
            component="div"
            id="main-content"
            data-testid="main-content"
          >
            {children}
          </Box>
        </HaLayoutStyled>
      </ThemeProvider>
    </AppLocationContext>
  );
}
