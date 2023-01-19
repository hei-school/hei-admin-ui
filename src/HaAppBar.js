import { AppBar as DefaultAppBar, AppBarClasses } from 'react-admin'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { Lock } from '@mui/icons-material'
import authProvider from './providers/authProvider'

const UserMenu = () => {
  const logout = () => {
    authProvider.logout()
    window.location.reload()
  }
  return (
    <Tooltip title='Se déconnecter' onClick={logout}>
      <IconButton color='inherit'>
        <Lock />
      </IconButton>
    </Tooltip>
  )
}

const HaAppBar = props => {
  return (
    <DefaultAppBar {...props} elevation={1} sx={{ bgcolor: '#ffbf00', color: 'black' }} userMenu={<UserMenu {...props} color='transparent' />}>
      <Typography variant='h6' color='inherit' className={AppBarClasses.title} id='react-admin-title' />
      {props.children}
    </DefaultAppBar>
  )
}

export default HaAppBar
