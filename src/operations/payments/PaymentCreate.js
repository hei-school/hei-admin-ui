import { useState, useEffect } from 'react'

import { Create, SimpleForm, TextInput, RadioButtonGroupInput, useDataProvider, required, minValue, number } from 'react-admin'
import { paymentTypes } from '../../conf'

import { studentIdFromRaId } from '../../providers/feeProvider'

const PaymentCreate = props => {
  const feeId = props.match.params.feeId
  const studentId = studentIdFromRaId(feeId)
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  const paymentConfToPaymentApi = ({ type, amount, comment }) => {
    return [{ feeId: feeId, type: paymentTypes[type].type, amount: amount, comment: comment }]
  }
  return (
    <Create {...props} title={`Paiement de ${studentRef}`} resource='payments' basePath={`/fees/${feeId}/show`} transform={paymentConfToPaymentApi}>
      <SimpleForm>
        <RadioButtonGroupInput {...props} source='type' label='Type' choices={Object.keys(paymentTypes).map(id => ({ id: id, name: paymentTypes[id].name }))} />
        <TextInput source='amount' label='Montant du paiement' fullWidth={true} validate={[required(), number(), minValue(1)]} />
        <TextInput source='comment' label='Commentaire' fullWidth={true} />
      </SimpleForm>
    </Create>
  )
}

export default PaymentCreate
