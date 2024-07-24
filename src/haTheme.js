import {createTheme} from "@mui/material/styles";
import {amber, indigo} from "@mui/material/colors";
import {grey} from "@mui/material/colors";

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

export const GRADIENT_PALETTE_COLORS = {
  yellow: {
    1: "#dfa408",
    2: "#e9b244",
    3: "#f1c16b",
    4: "#f7d090",
    5: "#fcdfb5",
    6: "#ffefda",
  },
  blue: {
    1: "#001948",
    2: "#323964",
    3: "#5a5c81",
    4: "#8182a0",
    5: "#aaaabf",
    6: "#d4d4de",
  },
};