import { createTheme } from '@mui/material/styles'
import { amber, indigo } from '@mui/material/colors'

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
  // change the default Mui or Ra component style
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'pink'
        }
      }
    },
    MuiButton: {
      // custom style depends of the color props
      variants: [
        {
          props: { color: 'error' },
          style: {
            background: 'red'
          }
        },
        {
          props: { color: 'info' },
          style: {
            background: 'blue'
          }
        }
      ]
    }
  }
})
