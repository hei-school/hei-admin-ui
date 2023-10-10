import { Box, Typography } from '@mui/material'
import { styled } from '@mui/styles'

//mock
const notificationMock = [
  { id: 1, title: 'Test est cors', value:'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'},
  { id: 2, title: 'Test2 est absent', value:'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'},
  { id: 3, title: 'Je suis un notification', value:'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.'}
]

function NotificationContent(){
  return(
    <Box sx={{width:'400px', maxHeight:'500px'}}>
      { notificationMock.map(el => (
        <Box sx={{
          height:'50px',
          padding: '7px 20px',
          cursor:'pointer',
          ':hover': { backgroundColor:'rgba(0,0,0,.1)'}
        }}>
          <Typography 
            sx={{
              fontSize: '1em', 
              color: 'rgba(0,0,0,.8)', 
              width:'100%',
              fontWeight:'bold',
              whiteSpace:'nowrap',
              overflow:'hidden',
              textOverflow:'ellipsis'
            }}
          >
            { el.title }
          </Typography>
          <Typography sx={{ 
            fontSize: '1em', 
            color: 'rgba(0,0,0,.6)', 
            whiteSpace:'nowrap', 
            textOverflow:'ellipsis' ,
            overflow: 'hidden' 
          }}>
            {el.value}
          </Typography>
        </Box> 
      ))}
    </Box>
  )
}

export default NotificationContent
