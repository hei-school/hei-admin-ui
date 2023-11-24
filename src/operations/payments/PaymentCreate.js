import { useState, useEffect } from 'react'

import {
  Create,
  SimpleForm,
  TextInput,
  RadioButtonGroupInput,
  useDataProvider,
  required,
  minValue,
  number,
  useNotify,
  DateTimeInput,
  BooleanInput
} from 'react-admin'
import { useParams } from 'react-router-dom'
import { paymentTypes } from '../../conf'
import { useToggle } from '../../hooks/useToggle'
import { studentIdFromRaId } from '../../providers/feeProvider'

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
  const validateConditions = [required()]
  const [paymentChoice, setPaymentChoice] = useState('cash')
  const notifyError = error => {
    let message = "Une erreur s`'est produite"
    if (error.response && error.response.status === 400) {
      message = 'Paiement pour date future non autorisé'
    }
    notify(message, { type: 'error', autoHideDuration: 2500 })
  }
  const paymentConfToPaymentApi = ({ type, amount, comment, creation_datetime }) => {
    const datetimeValue = notSpecifiedDate ? new Date().toISOString() : creation_datetime
    return [{ feeId, type: paymentTypes[type].type, amount, comment, creation_datetime: datetimeValue }]
  }

  return (
    <Create
      mutationOptions={{ onError: notifyError }}
      {...props}
      title={`Paiement de ${studentRef}`}
      resource='payments'
      redirect={(_basePath, _id, _data) => `fees/${feeId}/show`}
      transform={paymentConfToPaymentApi}
    >
      <SimpleForm>
        <RadioButtonGroupInput
          {...props}
          source='type'
          label='Type'
          validate={validateConditions}
          choices={Object.keys(paymentTypes).map(id => ({ id: id, name: paymentTypes[id].name }))}
          onChange={e => {
            setPaymentChoice(e.target.value)
          }}
        />
        <TextInput source='amount' label='Montant du paiement' fullWidth={true} validate={validateConditions} />
        <TextInput source='comment' label='Commentaire' fullWidth={true} validate={paymentChoice === 'mobileMoney' && validateConditions} />
        <BooleanInput
          source='specify-date'
          label={"Date de paiement aujourd'hui"}
          name='create'
          defaultValue={notSpecifiedDate}
          onChange={({ target: { checked } }) => setSpecifyDate(checked)}
        />
        {!notSpecifiedDate && (
          <DateTimeInput source='creation_datetime' label='Date de paiement' validate={validateConditions} defaultValue={new Date().toISOString()} />
        )}
      </SimpleForm>
    </Create>
  )
}

export default PaymentCreate
