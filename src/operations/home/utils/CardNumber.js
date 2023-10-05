import { CardStyle } from "../style"
import { Box, Typography } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'

const CardNumber = ({ sx = {}, icon }) =>{
  return (
    <Box sx={{ ...CardStyle, maxWidth:'250px', flex: 1, p: 1, backgroundColor:'white', ...sx }}>
      <Box sx={{
        display:'flex',
        alignItems:'center',
        width:'100%',
        maxHeight: '70px',
        justifyContent:'space-between',
        gap: 1,
      }}>
        { icon }
        <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'end' }}>
          <Typography sx={{ color:'gray' }}>Étudiants</Typography >
          <Typography sx={{ fontSize:'1.5em' }}>540</Typography >
        </Box>
      </Box>
      <Box sx={{ height:'1px', width:'100%', backgroundColor:'rgba(0,0,0,.1)', my:'3px' }}/>
      <Box sx={{ alignItems:'center', gap: 1, display:'flex'}}>
        <CalendarToday sx={{ fontSize: '11px' }}/>
        <Typography sx={{ fontSize:'14px', color: 'rgba(0,0,0,.6)' }}>2022 - 2023</Typography >
      </Box>
    </Box>
  )
}

export default CardNumber;
