import { AppLocationContext } from '@react-admin/ra-navigation'
import { styled, ThemeProvider } from '@mui/styles'
import { Box, useMediaQuery } from '@mui/material'
import { mainTheme } from '../haTheme'
import { HaMenu } from './menu/utils/'
import { HaAppBar } from './appBar'
import { useSidebarState } from 'react-admin'
import { createContext } from 'react'

const HaLayoutStyled = styled('div')({
  backgroundColor: '#ebe9e6',
  minHeight:'100vh',
  position:'relative',
  width:'100%'
})
export const LayoutContext = createContext()

export function HaLayout({ children }){
  const [open] = useSidebarState()
  const isSmall = useMediaQuery('(max-width:900px)')

  return (
    <AppLocationContext>
      <ThemeProvider theme={mainTheme}>
        <HaLayoutStyled>
          <HaMenu />
          <Box sx={{
            ml: (isSmall || !open ) ? 0 : '250px',
            width: (isSmall || !open ) ? '100%' : 'calc(100% - 250px)',
            boxSizing:'border-box',
            transition: 'all .3s linear'
          }} 
            component='div'
            id='main-content'
          >
            <HaAppBar />
            {children}
          </Box>
        </HaLayoutStyled>
      </ThemeProvider>
    </AppLocationContext>
  )  
}
