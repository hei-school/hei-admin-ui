import { 
  AppBar, 
  Typography,
  Box,
} from '@mui/material'
import { LoadingIndicator } from 'react-admin'
import LogoutMenu from './LogoutMenu'
import NotificationMenu from './NotificationMenu'
// import { AppBar as TestL } from 'react-admin'

const HaAppBar = ()=> {
  return (
    <AppBar position='sticky' sx={{
      // backgroundColor: '#ebe9e6', 
      backgroundColor: 'white', 
      // backgroundColor: '#f5c020', 
      display:'flex', 
      flexDirection:'row',
      boxShadow:'none',
      borderBottom:'1px solid rgba(0,0,0,.1)',
      alignItems:'center',
      p: 1,
      justifyContent:'space-between',
    }}> 
      <Typography variant='h2' sx={{fontSize: '1.4em',p: 0,fontWeight:'500', color:'#323333'}}>
        Page title
      </Typography>
      <Box sx={{display:'flex', alignItems: 'center'}}>
        <LoadingIndicator sx={{ color: '#40403f' }}/>
        <NotificationMenu />
        <LogoutMenu />
      </Box>
    </AppBar>
  )
}

export default HaAppBar
