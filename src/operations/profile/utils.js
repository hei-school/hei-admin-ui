import { unexpectedValue } from '../utils/typography'
import { UserSexEnum } from '../../gen/haClient'
import { EnableStatus } from '../../gen/haClient'
import { Link } from '@mui/material'

export const sexRenderer = user => {
  if (user.sex === UserSexEnum.F) return 'Homme'
  if (user.sex === UserSexEnum.M) return 'Femme'
  return unexpectedValue
}
export const statusRenderer = user => {
  if (user.status === EnableStatus.Enabled) return 'Actif·ve'
  if (user.status === EnableStatus.Disabled) return 'Suspendu·e'
  return unexpectedValue
}
export const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
