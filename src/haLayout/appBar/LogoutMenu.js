import { Lock } from '@mui/icons-material'
import authProvider from '../../providers/authProvider'
import { IconButton, Tooltip } from '@mui/material'

function LogoutMenu(){
  const logout = () => {
    authProvider.logout()
    window.location.reload()
  }

  return (
    <Tooltip title='Se déconnecter' onClick={logout}>
      <IconButton>
        <Lock sx={{ color: '#40403f' }}/>
      </IconButton>
    </Tooltip>
  )
}

export default LogoutMenu
