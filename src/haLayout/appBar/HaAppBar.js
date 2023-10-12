import { 
  AppBar, 
  Typography,
  Box,
  Slide,
  useScrollTrigger
} from '@mui/material'
import { AppBarClasses, LoadingIndicator, SidebarToggleButton } from 'react-admin'
import LogoutMenu from './LogoutMenu'
import NotificationMenu from './NotificationMenu'

const HaAppBar = ({ title })=> {
  const trigger = useScrollTrigger({})
    
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar id='appbar' position='sticky' sx={{
        backgroundColor: '#ffc619', 
        display:'flex', 
        flexDirection:'row',
        boxShadow:'none',
        borderBottom:'1px solid rgba(0,0,0,.1)',
        alignItems:'center',
        p: 1,
        color:'#323333',
        justifyContent:'space-between',
      }}> 
        <Box sx={{display: 'flex', alignItems:'center', gap: 1}}>
          <SidebarToggleButton className={AppBarClasses.menuButton} />
          <h2 id="pagetitle" style={{fontSize: '1.2em', padding:0,margin:0,fontWeight:'500', color:'#323333'}}>
            {/* title portal here */}
          </h2>
        </Box>
        <Box sx={{display:'flex', alignItems: 'center'}}>
          <LoadingIndicator sx={{ color: '#40403f' }}/>
          <NotificationMenu />
          <LogoutMenu />
        </Box>
      </AppBar>
    </Slide>
  )
}

export default HaAppBar
