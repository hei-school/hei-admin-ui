import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useContext } from 'react'
import { useGetOne } from 'react-admin'
import authProvider from '../../../providers/authProvider'
import { MenuHoverProvider } from '../../HaLayout'

function UserInfo(){
  const profile = useGetOne( 'profile', { id: authProvider.getCachedWhoami().id})
  const name = (profile && profile.data) ? profile.data.first_name : '' 
  const theme = useTheme() 
  const { isHover, open } = useContext(MenuHoverProvider)

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        my: 1,
        borderBottom: '1px solid rgba(255,255,255,.2)',
        borderTop: '1px solid rgba(255,255,255,.2)',
        px: 3,
        py: 2,
        width: '100%',
      }}
    >
      <Box sx={{ backgroundColor: theme.typography[':hover'], borderRadius:'50%'}}>
        <Typography variant='h3' sx={{fontSize:'1.5em', fontWeight:'bold',py: .7, px: 1.4}}>
          { name[0] && name[0].toUpperCase() }
        </Typography>
      </Box>
      { (open || isHover) && 
        <Typography variant='h2' sx={{fontSize: '1.2em',pb: .5}}>
          { name }
        </Typography>
      }
    </Box>
  )
}

export default UserInfo
