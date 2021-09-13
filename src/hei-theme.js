import { createTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import indigo from '@material-ui/core/colors/indigo'

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
  }
})

export const darkTheme = createTheme({
  palette: {
    type: 'dark'
  }
})

export default mainTheme
