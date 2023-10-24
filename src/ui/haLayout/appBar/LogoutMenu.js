import { Lock } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import authProvider from '../../../providers/authProvider'
import { palette } from '../../constants'

function LogoutMenu() {
  const logout = () => {
    authProvider.logout()
    window.location.reload()
  }

  return (
    <Tooltip title='Se déconnecter' onClick={logout}>
      <IconButton>
        <Lock sx={{ color: palette.black }} />
      </IconButton>
    </Tooltip>
  )
}

export default LogoutMenu
