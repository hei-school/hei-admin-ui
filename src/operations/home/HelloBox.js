import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/styles'
import { CardStyle } from './utils/style'

const HelloBoxContainer = styled('div')({
  ...CardStyle, 
  marginBottom: 10, 
  width: '100%',
  color: 'rgba(0,0,0,.7)', 
  // backgroundColor: 'rgba(255, 191, 0, .8)',
  backgroundColor: '#fadc6e',
  display: 'flex',
  gap: 2,
  flex: 2,
  justifyContent:'space-between'
})

function HelloBox(){
  return (
    <HelloBoxContainer>
      <Box sx={{width:'100%',flex: 1}}>
        <img src='home_image.png' style={{ maxHeight:'250px' }}/>
      </Box>
      <Box sx={{flex: 2, pr:5, maxHeight:'250px'}}>
        <Typography variant='h2' sx={{ fontSize:'2.5em', fontWeight: 'bold' }}>
          Bienvenue a nouveau
        </Typography>
        <Typography variant='p' sx={{fontSize:'1.2em'}}>
          Lorem ipsum dolor sit amet, 
          Lorem ipsum dolor sit amet, 
          qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
          qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
        </Typography>
        <Button 
          variant='outlined' 
          sx={{
            display:'block',
            color: 'inherit',
            my:1, 
            px: 3, 
            backgroundColor:'white', 
            fontWeight:'bold', 
            border:'none',
            '&:hover':{ border:'none', backgroundColor: 'white'}
          }}
          >
          Lancer
        </Button>
      </Box>
    </HelloBoxContainer>
  )
}


export default HelloBox
