import { unexpectedValue } from '../utils/typography'
import { UserSexEnum, EnableStatus } from '../../gen/haClient'
import { Link } from '@mui/material'

export const sexRenderer = user => {
  switch (user.sex) {
    case UserSexEnum.F:
      return 'Homme'
    case UserSexEnum.M:
      return 'Femme'
    default:
      return unexpectedValue
  }
}
export const statusRenderer = user => {
  switch (user.status) {
    case EnableStatus.Enabled:
      return 'Actif·ve'
    case EnableStatus.Disabled:
      return 'Suspendu·e'
    default:
      return unexpectedValue
  }
}
export const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
