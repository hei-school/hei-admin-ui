import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { MenuHoverProvider } from '../../HaLayout'

function SingleMenu({ label, icon, sx, to, fontSize = '1em', ...rest }){
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme() 
  const {isHover, open } = useContext(MenuHoverProvider)

  const handlerClick = ()=> to && navigate(to)
  const getColor = ()=> location.pathname.startsWith(to) ? theme.typography[':hover'] : 'inherit'

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
        color: getColor(),
        ':hover':{ color: theme.typography[':hover']},
        ...sx
      }}
      onClick={handlerClick}
      {...rest}
    >
      { icon }
      { ( open || isHover ) && 
        <Typography variant='h6' sx={{fontSize}}>
          {label}
        </Typography>
      } 
    </Box>
  )
}

export default SingleMenu;
