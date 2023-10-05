import React from 'react'
import { Link } from 'react-admin'
import { Box, Typography } from '@mui/material'
import HomeAside from './HomeAside'
import { styled } from '@mui/styles'
import StatStudent from './StatStudent'
import StatMoney from './StatMoney'

const HelloBox = styled('div')({
  borderRadius:'5px',
  padding:'20px', 
  display:'flex', 
  gap: 3,
  backgroundColor:'rgba(176, 192, 245, .4)',
  width:'100%',
  maxWidth:'800px',
  flex: 2
})

function Home(){
  return (
    <Box sx={{ width:'100%', p: 1, height:'100%', backgroundColor:'#ebe9e6' }}>
      <Box sx={{ display:'flex', gap:1}}>
        {/* <HelloBox> */}
        {/*   <Box sx={{ width:'100%', color:'rgba(0,0,0,.8)', flex: 2}}> */}
        {/*     <Typography variant='h2' sx={{ fontSize:'1.5em', color:'#214ad1'}}> */}
        {/*       Bienvenue à Hei admin */}
        {/*     </Typography> */}
        {/*     <Typography variant='h4' sx={{ fontSize:'1em', my:1, color:'rgba(0,0,0,.7)' }}> */}
        {/*       Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint  */}
        {/*       cillum sint consectetur cupidatat xillum sint consectetur cupidatat. */}
        {/*        sint consectetur cupidatat xillum sint consectetur cupidatat. */}
        {/*     </Typography> */}
        {/*     <Link to='/profile'>Voir plus</Link> */}
        {/*   </Box> */}
        {/*   <Box sx={{ flex: 1 }}> */}
        {/*     <img src='/home_image.png' style={{ width:'100%' }}/> */}
        {/*   </Box> */}
        {/* </HelloBox> */}
        <HomeAside />
      </Box>
      <Box sx={{ display:'flex', gap: 1}}>
        <StatStudent />
        <StatMoney />
      </Box>
    </Box>
  ) 
} 

export default Home; 
