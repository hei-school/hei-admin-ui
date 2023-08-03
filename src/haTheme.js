import { createTheme } from '@mui/material/styles';
import { amber, indigo } from '@mui/material/colors';

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: indigo[800]
    },
    secondary: {
      main: amber[500]
    }
  },
  typography: {
    fontFamily: ['Quicksand', 'sans-serif'].join(','),
    fontSize: 15
  },
  //shadows: Array(25).fill('none')

  components: {
    RaSimpleShowLayout: {
      styleOverrides: {
        root: {
          "& .RaSimpleShowLayout-stack": {
            backgroundColor: "rgb(256,253,254)",
            width: "25%",
            margin: "0 auto", 
            textAlign: "center",
            fontFamily: 'Arial, sans-serif'
          }
        },
      },
    },
    RaBreadcrumb: { 
      styleOverrides: {
        root: {
          "& .RaBreadcrumb-list": {
            backgroundColor: 'rgb(79,60,201)', 
          }
        },
      },
    },
  },
});
