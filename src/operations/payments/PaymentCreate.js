import { useState, useEffect } from 'react'

import { Create, SimpleForm, TextInput, RadioButtonGroupInput, useDataProvider, required, useNotify, DateInput, BooleanInput } from 'react-admin'
import { useParams } from 'react-router-dom'
import { paymentTypes } from '../../conf'
import { useToggle } from '../../hooks/useToggle'
import { studentIdFromRaId } from '../../providers/feeProvider'
import { PaymentTypeEnum } from '@haapi/typescript-client'

const PaymentCreate = props => {
  const params = useParams()
  const notify = useNotify()
  const feeId = params.feeId
  const studentId = studentIdFromRaId(feeId)
  const [notSpecifiedDate, setSpecifyDate] = useToggle(true)
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })
  const [paymentChoice, setPaymentChoice] = useState(PaymentTypeEnum.BANK_TRANSFER)
  const notifyError = error => {
    let message = "Une erreur s`'est produite"
    if (error.response && error.response.status === 400) {
      if (error.response.message.startsWith('Payment amount')) message = 'Le paiement dépasse le montant restant du frais'
      else message = 'Paiement pour date future non autorisé'
    }
    notify(message, { type: 'error', autoHideDuration: 2500 })
  }
  const paymentConfToPaymentApi = ({ ref, type, amount, comment, creation_datetime }) => {
    const datetimeValue = notSpecifiedDate ? new Date().toISOString() : new Date(creation_datetime).toISOString()
    return [{ feeId, type, amount, comment, ref, creation_datetime: datetimeValue }]
  }

  return (
    <Create
      mutationOptions={{ onError: notifyError }}
      title={`Paiement de ${studentRef}`}
      resource='payments'
      redirect={(_basePath, _id, _data) => `fees/${feeId}/show`}
      transform={paymentConfToPaymentApi}
      {...props}
    >
      <SimpleForm>
        <RadioButtonGroupInput
          {...props}
          source='type'
          label='Type'
          validate={required()}
          choices={paymentTypes}
          defaultValue={PaymentTypeEnum.BANK_TRANSFER}
          onChange={event => setPaymentChoice(event.target.value)}
        />
        {paymentChoice === PaymentTypeEnum.BANK_TRANSFER && <TextInput source='ref' label='Réference' fullWidth validate={required()} />}
        <TextInput source='amount' label='Montant du paiement' fullWidthvalidate={required()} />
        <TextInput source='comment' label='Commentaire' fullWidth validate={paymentChoice === PaymentTypeEnum.MOBILE_MONEY && required()} />
        <BooleanInput
          source='specify-date'
          label={"Date de paiement aujourd'hui"}
          name='create'
          defaultValue={notSpecifiedDate}
          onChange={({ target: { checked } }) => setSpecifyDate(checked)}
        />
        {!notSpecifiedDate && <DateInput source='creation_datetime' label='Date de paiement' validate={required()} defaultValue={new Date().toISOString()} />}
      </SimpleForm>
    </Create>
  )
}

export default PaymentCreate
