import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function SingleMenu({ label, icon, sx, to, fontSize = '1em' }){
  const navigate = useNavigate()
  const handlerClick = ()=> to && navigate(to)

  return (
    <Box 
      sx={{
        display:'flex',
        width:'100%',
        px:3,
        py: 1,
        alignItems:'center',
        mb: 1,
        gap:2, 
        cursor: to ? 'pointer': 'default',
        ':hover':{backgroundColor:'#575859'},
        ...sx
      }}
      onClick={handlerClick}
    >
      { icon }
      <Typography variant='h6' sx={{fontSize}}>
        {label}
      </Typography>
    </Box>
  )
}

export default SingleMenu;
