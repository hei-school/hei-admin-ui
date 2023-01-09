import { AppBar } from 'react-admin'

import { IconButton, Tooltip } from '@mui/material'
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

const HaAppBar = props => <AppBar {...props} languages={[]} color='transparent' elevation={0} userMenu={<UserMenu {...props} />} sx={{ bgcolor: '#ffbf00' }} />
export default HaAppBar
