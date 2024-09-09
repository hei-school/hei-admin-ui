import {PALETTE_COLORS} from "@/haTheme";

export const GRID_STYLE = () => ({
  item: {
    xs: 12,
    sm: 6,
    md: 5,
    backgroundColor: PALETTE_COLORS.white,
    borderRadius: "10px",
    padding: "2em",
    margin: {xs: "1em 0", sm: "1em"},
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
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
