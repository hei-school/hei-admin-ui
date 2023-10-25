import { Popover, Badge, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import { Notifications } from '@mui/icons-material'
import { palette } from '../constants/palette'
import NotificationContent from './NotificationContent'

function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <>
      <Tooltip title='Notification' onClick={e => setAnchorEl(e.currentTarget)}>
        <IconButton>
          <Badge badgeContent={0} sx={{ color: palette.yellow }}>
            <Notifications sx={{ color: palette.black }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <NotificationContent />
      </Popover>
    </>
  )
}

export default NotificationMenu
