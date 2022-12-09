import { AppBar } from '@react-admin/ra-enterprise'

import { IconButton, Tooltip } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
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
