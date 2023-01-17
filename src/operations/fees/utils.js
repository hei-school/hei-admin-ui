import { FeeStatusEnum } from '../../gen/haClient'
import { withRedWarning, unexpectedValue } from '../utils/typography'
export const statusRenderer = user => {
  if (user.status === FeeStatusEnum.Late) return withRedWarning('En retard')
  if (user.status === FeeStatusEnum.Paid) return 'Payé'
  if (user.status === FeeStatusEnum.Unpaid) return 'En attente'
  return unexpectedValue
}
