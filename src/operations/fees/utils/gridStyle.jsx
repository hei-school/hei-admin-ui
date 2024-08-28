import {PALETTE_COLORS} from "@/haTheme";

export const gridStyle = () => ({
  item: {
    xs: 12,
    sm: 6,
    md: 5,
    backgroundColor: PALETTE_COLORS.primary,
    borderRadius: "10px",
    padding: "2em",
    margin: {xs: "1em 0", sm: "1em"},
    color: "white",
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
