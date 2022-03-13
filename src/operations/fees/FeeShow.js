import { useState, useEffect } from 'react'

import { DateField, FunctionField, SimpleShowLayout, Show, TextField, useDataProvider } from 'react-admin'

import { prettyPrintMoney } from '../utils/money'
import { withRedWarning, unexpectedValue } from '../utils/typography'

export const FeeLayout = () => {
  const statusRenderer = user => {
    if (user.status === 'LATE') return withRedWarning('En retard')
    if (user.status === 'PAID') return 'Payé'
    if (user.status === 'UNPAID') return 'En attente'
    return unexpectedValue
  }
  return (
    <SimpleShowLayout>
      <DateField source='creation_datetime' label='Date de création' />
      <DateField source='due_datetime' label='Date limite de paiement' />
      <TextField source='comment' label='Commentaire' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const FeeShow = props => {
  const studentId = props.match.params.studentId
  const [studentRef, setStudentRef] = useState()
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  const feeId = props.match.params.feeId

  return (
    <Show id={feeId} resource='fees' basePath={`/students/${studentId}/fees/${feeId}/show`} title={`Frais de ${studentRef}`}>
      <FeeLayout />
    </Show>
  )
}

export default FeeShow
