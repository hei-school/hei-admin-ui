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

const LetterStyled = styled('p')({
  padding: '3px 11px',
  backgroundColor: palette.yellow,
  borderRadius: '50%',
  margin: 0,
  color: 'inherit',
  fontSize: '1.3em',
  fontWeight: 'bold'
})

function UserInfo() {
  const profile = useGetOne('profile', { id: authProvider.getCachedWhoami().id })
  const name = profile && profile.data ? profile.data.first_name : ''

  return (
    <StyledUserInfo>
      <LetterStyled>{name ? name.at(0).toUpperCase() : '-'}</LetterStyled>
      <Typography sx={{ color: 'inherit' }}>{name}</Typography>
    </StyledUserInfo>
  )
}

export default UserInfo
