import { EnableStatus, UserSexEnum } from '../../gen/haClient'
import { Link, Typography, Stack, Chip } from '@mui/material'
import { amber } from '@mui/material/colors'
import { unexpectedPropValue } from '../utils'

export const renderLocation = user => {
  const { location } = user

  if (!location) {
    return <Typography variant='body2'>Champ non renseigné</Typography>
  }

  const { latitude, longitude } = location

  return (
    <Stack direction='row' spacing={2.5} alignItems='center' py={1}>
      <Chip label={`latitude: ${latitude}`} sx={{ bgcolor: amber[200] }} size='small' />
      <Chip label={`longitude: ${longitude}`} sx={{ bgcolor: amber[200] }} size='small' />
    </Stack>
  )
}

export const renderSex = user => {
  switch (user.sex) {
    case UserSexEnum.M:
      return 'Homme'
    case UserSexEnum.F:
      return 'Femme'
    default:
      return unexpectedPropValue('sex', user.sex)
  }
}

export const renderStatus = user => {
  switch (user.status) {
    case EnableStatus.Enabled:
      return 'Actif·ve'
    case EnableStatus.Disabled:
      return 'Suspendu·e'
    default:
      return unexpectedPropValue('status', user.status)
  }
}

export const renderPhone = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
