import { AppBar } from 'react-admin'

import { IconButton, Tooltip } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import authProvider from './providers/authProvider'

const LogoutMenu = props => {
  const onClick = () => {
    authProvider.logout()
    window.location.reload()
  }
  return (
    <div onClick={onClick} id='logout'>
      <Tooltip title='Se déconnecter'>
        <IconButton color='inherit'>
          <LockIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const HaAppBar = props => <AppBar {...props} userMenu={<LogoutMenu {...props} />} />
export default HaAppBar
