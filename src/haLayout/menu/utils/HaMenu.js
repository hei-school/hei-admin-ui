import { Typography } from '@mui/material'
import { styled } from '@mui/styles'
import SingleMenu from './SingleMenu'
import UserInfo from './UserInfo'
import {  AccountCircleOutlined,  HomeOutlined } from '@mui/icons-material'
import HaMenuContent from '../HaMenuContent'

export const whiteLight = '#e3e2de'
const HaMenuStyled = styled('div')({
  backgroundColor:'#363636',
  minWidth:'250px',
  height:'100vh',
  overflowY:'auto', 
  position:'fixed',
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  top: 0,
  paddingTop: 15,
  color: whiteLight,
})

function HaMenu(){
  return (
    <HaMenuStyled>
      <Typography variant='h1' sx={{color: 'inherit', fontSize:'1.2em',mb:2,fontWeight:400}}>
        HEI ADMIN
      </Typography>
      <UserInfo />
      <SingleMenu label='Profile' icon={<AccountCircleOutlined />} to='/profile'/>
      <HaMenuContent />
    </HaMenuStyled>
  )
}

export default HaMenu
