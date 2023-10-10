import { Typography } from '@mui/material'
import { styled } from '@mui/styles'
import { School, AccountCircle, Home, Warning, People, Work } from '@mui/icons-material'
import ListMenu from './ListMenu'
import ListMenuItem from './ListMenuItem'
import SingleMenu from './SingleMenu'

export const whiteLight = '#e3e2de'
const HaMenuStyled = styled('div')({
  backgroundColor:'#363636',
  // backgroundColor:'#8a5b03',
  // backgroundColor: '#ba7a02',
  // backgroundImage: 'linear-gradient(to top, #363636, #898b8c )',
  minWidth:'250px',
  height:'100vh',
  overflowY:'auto', 
  position:'fixed',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  top: 0,
  paddingTop: 13,
  color: whiteLight,
})


function HaMenu(){
  return (
    <HaMenuStyled>
      <Typography variant='h1' sx={{color: 'inherit', fontSize:'1.2em',mb:2,fontWeight:400}}>
        HEI ADMIN
      </Typography>
      <SingleMenu label='Home' icon={<Home />} to='/home'/>
      <SingleMenu label='Profile' icon={<AccountCircle />} to='/profile'/>
      <SingleMenu to='/teachers' label='Enseignants' icon={<Work />} />
      <ListMenu label='Étudiants' icon={<School />}>
        <ListMenuItem label='Liste des étudiants' icon={<People sx={{fontSize: '20px'}} />} to='/students'/>
        <ListMenuItem label='Frais en retards' icon={<Warning sx={{fontSize: '20px'}} />} to='/fees'/>
      </ListMenu>
    </HaMenuStyled>
  )
}

export default HaMenu
