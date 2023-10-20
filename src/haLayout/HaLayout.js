import { AppLocationContext } from '@react-admin/ra-navigation'
import { styled, ThemeProvider } from '@mui/styles'
import { Box } from '@mui/material'
import { mainTheme } from '../haTheme'
import { HaMenu } from './menu/utils/'
import { HaAppBar } from './appBar'
import { useSidebarState } from 'react-admin'

const HaLayoutStyled = styled('div')({
  backgroundColor: '#ebe9e6',
  minHeight:'100vh',
  position:'relative',
  width:'100%'
})

export function HaLayout({ children }){
  const [open] = useSidebarState()

  return (
    <AppLocationContext>
      <ThemeProvider theme={mainTheme}>
        <HaLayoutStyled>
          <HaMenu />
          <Box sx={{
            ml: open ? '250px' : 0,
            width: open ? 'calc(100% - 250px)' : '100%',
            boxSizing:'border-box',
            transition: 'all .35s linear'
          }}>
            <HaAppBar />
            {children}
          </Box>
        </HaLayoutStyled>
      </ThemeProvider>
    </AppLocationContext>
  )  
}
