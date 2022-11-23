import { useState, useEffect } from 'react'

import { FunctionField, SimpleShowLayout, Show, TextField, useDataProvider } from 'react-admin'

import { prettyPrintMoney } from '../utils/money'
import { withRedWarning, unexpectedValue } from '../utils/typography'

import { Divider, Typography } from '@mui/material'
import PaymentList from '../payments/PaymentList'

import { studentIdFromRaId } from '../../providers/feeProvider'
import { useParams } from 'react-router-dom'
import { CustomDateField } from './ByStatusFeeList'

export const FeeLayout = ({ feeId }) => {
  const statusRenderer = user => {
    if (user.status === 'LATE') return withRedWarning('En retard')
    if (user.status === 'PAID') return 'Payé'
    if (user.status === 'UNPAID') return 'En attente'
    return unexpectedValue
  }
  return (
    <SimpleShowLayout>
      <CustomDateField label='Date de création' source='creation_datetime' />
      <CustomDateField label='Date limite de paiement' source='due_datetime' />
      <TextField source='comment' label='Commentaire' />
      <FunctionField label='Total à payer' render={record => prettyPrintMoney(record.total_amount)} textAlign='right' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <FunctionField label='Statut' render={statusRenderer} />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography>Paiements</Typography>
      <PaymentList feeId={feeId} />
    </SimpleShowLayout>
  )
}

const FeeShow = props => {
  const params = useParams()
  const feeId = params.feeId
  const studentId = studentIdFromRaId(feeId)
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
    // eslint-disable-next-line
  }, [studentId])

  return (
    <Show id={feeId} resource='fees' basePath={`/fees/${feeId}/show`} title={`Frais de ${studentRef}`}>
      <FeeLayout feeId={feeId} />
    </Show>
  )
}

export default FeeShow
