import {amber, grey, indigo} from "@mui/material/colors";
import {createTheme} from "@mui/material/styles";

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: indigo[800],
    },
    secondary: {
      main: amber[500],
    },
  },
  typography: {
    fontFamily: "Quicksand, sans-serif",
  },
});

export const PALETTE_COLORS = {
  black: "#323333",
  yellow: "#DFA408",
  white: "#fafbfc",
  lightgrey: "#f0efed",
  bgGrey: "#F0F0F0",
  grey: "#e0e0e0",
  primary: "#001948",
  typography: {
    grey: grey[700],
    black: "#323333",
  },
  red: "#D32F2F",
};
