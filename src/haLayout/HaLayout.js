import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { styled } from '@mui/styles';
import { AppLocationContext } from '@react-admin/ra-navigation';
import { useState } from 'react';
import { useSidebarState } from 'react-admin';
import { createContext } from 'react';
import { mainTheme } from '../haTheme';
import HaAppBar from './appBar';
import { HaMenu } from './menu';

const HaLayoutStyled = styled('div')({
  backgroundColor: '#ebe9e6',
  minHeight:'100vh',
  position:'relative',
  width:'100%',
})

export const MenuHoverProvider = createContext();

const HaLayout = (props) => {
  const { children, title } = props
  const [ open ] = useSidebarState()
  const [ isHover, setIsHover ]= useState(false)

  return (
    <AppLocationContext>
      <MenuHoverProvider.Provider value={{ isHover, setIsHover, open }} >
        <ThemeProvider theme={mainTheme}>
          <HaLayoutStyled>
            <HaMenu hoverState={{ isHover, setIsHover }} />
            <Box sx={{
              zIndex:55,
              transition: 'all .5s',
              marginLeft: open || isHover ? '250px' : '80px', 
              width: open || isHover ? 'calc(100% - 250px)' : 'cacl(100% - 100px)',
              display:'flex', 
              flexDirection:'column'}}
            >
              <HaAppBar title={title}/>
              {children}
            </Box>
          </HaLayoutStyled>
        </ThemeProvider>
      </MenuHoverProvider.Provider>
    </AppLocationContext>
  );
} 
export default HaLayout;
