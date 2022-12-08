import { AppBar } from '@react-admin/ra-enterprise'

import { IconButton, Tooltip } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import authProvider from './providers/authProvider'

const UserMenu = () => {
  const logout = () => {
    authProvider.logout()
    window.location.reload()
  }
  return (
    <Tooltip title='Se déconnecter' onClick={logout}>
      <IconButton color='inherit'>
        <LockIcon />
      </IconButton>
    </Tooltip>
  )
}

const HaAppBar = props => <AppBar {...props} languages={[]} color='transparent' elevation={0} userMenu={<UserMenu {...props} />} />
export default HaAppBar
