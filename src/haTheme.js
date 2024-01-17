import {createTheme} from "@mui/material/styles";
import {amber, indigo} from "@mui/material/colors";
import { PALETTE_COLORS } from "./ui/constants";

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
    fontFamily: 'Quicksand, sans-serif'
  },
});
