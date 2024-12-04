import {PALETTE_COLORS} from "@/haTheme";

export const GRID_STYLE = (isSmall: boolean) => ({
  item: {
    backgroundColor: PALETTE_COLORS.white,
    borderRadius: "10px",
    padding: isSmall ? "1.5rem" : "2em",
    margin: {xs: "1em 0", sm: "1em"},
    boxShadow: "rgba(149, 157, 165, 0.5) 0px 8px 24px",
    width: isSmall ? "91%" : "45%",
  },
  box: {
    display: "flex",
    alignItems: "center",
  },
  font: {
    fontWeight: "bold",
    fontSize: "1.5em",
    fontFamily: "arial",
  },
});
