import { Box, Typography } from '@mui/material'
import { palette } from '../constants/palette'

//TODO: wait for backend implementation
function NotificationContent() {
  return (
    <Box sx={{ p: 2, width: '250px', overflowY: 'sroll', maxHeight: '300px' }}>
      <Typography sx={{ fontSize: '1em', color: palette.black }}>Aucune notification</Typography>
    </Box>
  )
}

export default NotificationContent
