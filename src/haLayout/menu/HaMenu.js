import { Box, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/styles'
import { amber, indigo } from '@mui/material/colors'

const HaMenuStyled = styled('div')({
  // backgroundColor:'#363636',
  backgroundColor: '#ba7a02',
  minWidth:'250px',
  height:'100vh',
  overflowY:'scroll', 
  position:'fixed',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  top: 0,
  paddingTop: 13
})

const whiteLight = '#e3e2de'

function HaMenu(){
  return (
    <HaMenuStyled>
      <Typography variant='h1' sx={{color: whiteLight, fontSize:'1.3em', fontWeight:400}}>
        Hei Admin
      </Typography>
    </HaMenuStyled>
  )
}

export default HaMenu
