import { AppBar, Box, Slide, useScrollTrigger } from '@mui/material'
import { AppBarClasses, LoadingIndicator, SidebarToggleButton } from 'react-admin'
import { palette } from '../../constants'
import LogoutMenu from './LogoutMenu'
import NotificationMenu from '../../notification/NotificationMenu'

export const HaAppBar = () => {
  const trigger = useScrollTrigger()

  const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: palette.black,
    boxShadow: 'none',
    p: 1,
    backgroundColor: palette.yellow
  }

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      <AppBar id='appbar' position='sticky' sx={style}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SidebarToggleButton className={AppBarClasses.menuButton} />
          <h2 id='react-admin-title' style={{ fontSize: '1.2em', padding: 0, margin: 0, fontWeight: '500', color: palette.black }}>
            {/* title portal here */}
          </h2>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LoadingIndicator sx={{ color: palette.black }} />
          <NotificationMenu />
          <LogoutMenu />
        </Box>
      </AppBar>
    </Slide>
  )
}

export default HaAppBar
