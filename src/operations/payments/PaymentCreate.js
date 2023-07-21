import { useEffect, useState } from 'react'

import { Create, RadioButtonGroupInput, SimpleForm, TextInput, required, useDataProvider } from 'react-admin'
import { useParams } from 'react-router-dom'
import { paymentTypes } from '../../conf'

import { studentIdFromRaId } from '../../providers/feeProvider'

const PaymentCreate = props => {
  const [studentRef, setStudentRef] = useState('...')
  const [paymentChoice, setPaymentChoice] = useState('cash')

  const params = useParams()
  const dataProvider = useDataProvider()

  const feeId = params.feeId
  const studentId = studentIdFromRaId(feeId)

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  const validateConditions = [required()]

  const paymentConfToPaymentApi = ({ type, amount, comment }) => {
    return [{ feeId: feeId, type: paymentTypes[type].type, amount: amount, comment: comment }]
  }

  return (
    <Create
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
          choices={Object.keys(paymentTypes).map(id => ({ id: id, name: paymentTypes[id].name }))}
          onChange={e => {
            setPaymentChoice(e.target.value)
          }}
        />
        <TextInput source='amount' label='Montant du paiement' fullWidth={true} validate={validateConditions} />
        <TextInput source='comment' label='Commentaire' fullWidth={true} validate={paymentChoice === 'mobileMoney' && validateConditions} />
      </SimpleForm>
    </Create>
  )
}

export default PaymentCreate
