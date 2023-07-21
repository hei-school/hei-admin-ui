// eslint-disable-next-line
import { useEffect, useState } from 'react'

import { FunctionField, Show, SimpleShowLayout, useDataProvider } from 'react-admin'
import { useParams } from 'react-router-dom'

import { Divider, Typography } from '@mui/material'

import { studentIdFromRaId } from '../../providers/feeProvider'
import PaymentList from '../payments/PaymentList'
import { commentFunctionRenderer, CustomDateField, prettyPrintMoney, statusRenderer, withRedWarning } from '../utils'

const dateTimeRenderer = data => {
  return data.updated_at == null ? (
    <CustomDateField source='creation_datetime' showTime={true} />
  ) : (
    <CustomDateField source='updated_at' label='Date et heure de dernière modification' showTime={true} />
  )
}

export const FeeLayout = ({ feeId }) => {
  return (
    <SimpleShowLayout>
      <CustomDateField label='Date de création' source='creation_datetime' showTime={false} />
      <CustomDateField label='Date limite de paiement' source='due_datetime' showTime={false} />
      <FunctionField source='comment' render={commentFunctionRenderer} label='Commentaire' />
      <FunctionField label='Total à payer' render={record => prettyPrintMoney(record.total_amount)} textAlign='right' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <FunctionField
        label='Statut'
        render={record => (record.status === 'LATE' ? withRedWarning(statusRenderer(record.status)) : statusRenderer(record.status))}
      />
      <FunctionField label='Date et heure de dernière modification' render={dateTimeRenderer} />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography>Paiements</Typography>
      <PaymentList feeId={feeId} />
    </SimpleShowLayout>
  )
}

const FeeShow = props => {
  const params = useParams()
  const dataProvider = useDataProvider()

  const [studentRef, setStudentRef] = useState('...')

  const feeId = params.feeId
  const studentId = studentIdFromRaId(feeId)

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  }, [studentId])

  return (
    <Show id={feeId} resource='fees' basePath={`/fees/${feeId}/show`} title={`Frais de ${studentRef}`}>
      <FeeLayout feeId={feeId} />
    </Show>
  )
}

export default FeeShow
