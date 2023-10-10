import { Box, Typography } from '@mui/material'
import { useGetOne } from 'react-admin'
import authProvider from '../../../providers/authProvider'
import { whiteLight } from './HaMenu'

function UserInfo(){
  const profile = useGetOne( 'profile', { id: authProvider.getCachedWhoami().id})
  const name = (profile && profile.data) ? profile.data.first_name : '' 

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
        overflow:'hidden'
    }}>
      <Box sx={{width: 35, height: 35 }}>
        <img src='/profile.jpg' style={{ width:'100%', borderRadius: '50%'}}/>  
      </Box>
      <Typography variant='h2' sx={{fontSize: '1.2em', color: whiteLight}}>
        { name }
      </Typography>
    </Box>
  )
}

export default UserInfo
