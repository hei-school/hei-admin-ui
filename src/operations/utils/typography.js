export const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
export const unexpectedValue = withRedWarning('?')

export const statusRenderer = status => {
  if (status === 'LATE') return 'En retard'
  if (status === 'PAID') return 'Payé'
  if (status === 'UNPAID') return 'En attente'
  if (status === 'PARTIALLY_PAID') return 'Partiellement payé'
  return unexpectedValue
}
