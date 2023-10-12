import { Typography, Box } from '@mui/material'
import { ThemeProvider } from '@mui/styles'
import SingleMenu from './SingleMenu'
import UserInfo from './UserInfo'
import {  AccountCircleOutlined } from '@mui/icons-material'
import HaMenuContent from '../HaMenuContent'
import { createTheme } from '@mui/material/styles';
import { useContext } from 'react'
import { MenuHoverProvider } from '../../HaLayout'


const HaMenuStyled = {
  backgroundColor:'#363636',
  height:'100vh',
  overflowY:'auto', 
  overflowX: 'hidden',
  position:'fixed',
  transition: 'all .5s',
  paddingTop: 1,
  color: '#e3e2de',
  top: 0,
  left: 0
}

const MenuTheme = createTheme({
  typography:{
    color: '#e3e2de',
    ':hover': '#edb91a'
  }
})

function HaMenu(){
  const { isHover, setIsHover, open } = useContext(MenuHoverProvider) 

  return (
    <ThemeProvider theme={MenuTheme}>
      <Box
        component='div'
        sx={{ 
          ...HaMenuStyled,
          borderRight: open || isHover ? 'none': '10px solid #363636',
          width: open || isHover ? '250px' : '80px'
        }}
        onMouseOver={()=> !open && setIsHover(true) }
        onMouseLeave={()=> !open && setIsHover(false) }
      >
        <Box sx={{ display:'flex', width: '100%',alignItems:'center', gap:2, my:2, px: 3}}>
          <img src='/menu-logo.png' style={{ width: 40, height: 27 }}/>
          { ( open || isHover )  && 
            <Typography variant='h1' sx={{ fontSize:'1.1em', fontWeight:400 }}>
              HEI Admin
            </Typography>
          } 
        </Box>
        <UserInfo />
        <SingleMenu label='Profile' icon={<AccountCircleOutlined />} to='/profile'/>
        <HaMenuContent />
      </Box>
    </ThemeProvider>
  )
}

export default HaMenu
