import { FeeStatusEnum } from '../../gen/haClient'
import { withRedWarning, unexpectedValue } from '../utils'
export const statusRenderer = user => {
  switch (user.status) {
    case FeeStatusEnum.Late:
      return withRedWarning('En retard')
    case FeeStatusEnum.Paid:
      return 'Payé'
    case FeeStatusEnum.Unpaid:
      return 'En attente'
    default:
      return unexpectedValue
  }
}
