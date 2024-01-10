import { Typography } from '@mui/material'
import { styled } from '@mui/styles'
import { useGetOne } from 'react-admin'
import { palette } from '../../../constants'
import authProvider from '../../../../providers/authProvider'

const StyledUserInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 15,
  padding: '10px 0',
  width: '100%',
  color: palette.white
})

function UserInfo() {
  const profile = useGetOne('profile', { id: authProvider.getCachedWhoami().id })

  const name = profile && profile.data ? profile.data.first_name : ''

  const ProfileImage = ({ src }) => (<img src={src} style={{ height: 25, width: 25, borderRadius: '50%' }} />)

  const ProfilePicture = () => (profile?.data?.profile_picture ? <ProfileImage src={profile.data.profile_picture} /> : <ProfileImage src='/blank-profile-photo.png' />)

  return (
    <StyledUserInfo>
      <ProfilePicture />
      <Typography sx={{ color: 'inherit' }}>{name}</Typography>
    </StyledUserInfo>
  )
}

export default UserInfo
