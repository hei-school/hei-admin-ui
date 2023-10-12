import { Box, Typography } from '@mui/material'

function NotificationContent(){
  return(
    <Box sx={{width:'400px',p: 2 ,maxHeight:'500px'}}>
      <Typography sx={{fontSize:'1em', color: '#343536'}}>
        Aucune notification
      </Typography>
    </Box>
  )
}

export default NotificationContent
