export const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
export const unexpectedValue = withRedWarning('?')
export const unexpectedPropValue = (propName, value) => withRedWarning(`Unexpected value '${value}' for the prop(${propName})`)

// TODO: move this in the dedicated directory
export const statusRenderer = status => {
  if (status === 'LATE') return 'En retard'
  if (status === 'PAID') return 'Payé'
  if (status === 'UNPAID') return 'En attente'
  return unexpectedValue
}
