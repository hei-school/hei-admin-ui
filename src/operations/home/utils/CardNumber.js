import { CardStyle } from "./style"
import { Box, Typography } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'

const CardNumber = ({ sx = {}, icon, value }) =>{
  const currentYear = new Date().getFullYear()

  return (
    <Box sx={{ ...CardStyle, flex: 1, p: 1, backgroundColor:'white', ...sx }}>
      <Box sx={{
        display:'flex',
        alignItems:'center',
        width:'100%',
        maxHeight: '70px',
        justifyContent:'space-between',
        gap: 1,
      }}>
        { value.icon }
        <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'end' }}>
          <Typography sx={{ color:'gray' }}>{value.label}</Typography >
          <Typography sx={{ fontSize:'1.5em' }}>{ value.count}</Typography >
        </Box>
      </Box>
      <Box sx={{ height:'1px', width:'100%', backgroundColor:'rgba(0,0,0,.1)', my:'3px' }}/>
      <Box sx={{ alignItems:'center', gap: 1, display:'flex'}}>
        <CalendarToday sx={{ fontSize: '11px' }}/>
        <Typography sx={{ fontSize:'14px', color: 'rgba(0,0,0,.6)' }}>{currentYear} - {currentYear + 1}</Typography >
      </Box>
    </Box>
  )
}

export default CardNumber;
