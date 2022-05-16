import { AppBar } from 'react-admin'

import { IconButton, Tooltip } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import LockIcon from '@material-ui/icons/Lock'
import authProvider from './providers/authProvider'

import { useHistory } from 'react-router-dom'

const UserMenu = () => {
  const history = useHistory()
  const goBack = () => history.goBack()
  const logout = () => {
    authProvider.logout()
    window.location.reload()
  }
  return (
    <div>
      <Tooltip title='Retourner en arrière' onClick={goBack}>
        <IconButton color='inherit'>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Se déconnecter' onClick={logout}>
        <IconButton color='inherit'>
          <LockIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const HaAppBar = props => <AppBar {...props} userMenu={<UserMenu {...props} />} />
export default HaAppBar
