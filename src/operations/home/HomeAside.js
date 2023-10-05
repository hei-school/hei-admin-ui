import { Box } from '@mui/material'
import { PeopleAltOutlined, Language } from '@mui/icons-material'
import CardNumber from './utils/CardNumber' 

function HomeAside(){
  return (
    <Box sx={{ width:'100%',display:'flex',justifyContent:'space-between', gap: 1, flex: 1}}>
      <Box sx={{ flex: 1, display:'flex', gap: 1, width:'100%' }}>
        <CardNumber icon={<Language sx={{ fontSize:'2em', color: '#ed7866'}}/>} />
        <CardNumber icon={<PeopleAltOutlined sx={{ fontSize:'2em', color:'#5bd465' }} />} />
      </Box>
      <Box sx={{ flex: 1, display:'flex', gap: 1, width:'100%' }}>
        <CardNumber icon={<Language sx={{ fontSize:'2em', color: '#60bfd6'}}/>} />
        <CardNumber icon={<PeopleAltOutlined sx={{ fontSize:'2em', color:'#f7d652' }} />} />
      </Box>
    </Box>
  )
}       

export default HomeAside
