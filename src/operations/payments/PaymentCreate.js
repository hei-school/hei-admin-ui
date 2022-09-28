import { useState, useEffect } from 'react'

import { Create, SimpleForm, TextInput, RadioButtonGroupInput, useDataProvider, required, minValue, number } from 'react-admin'
import { useParams } from 'react-router-dom'
import { paymentTypes } from '../../conf'

import { studentIdFromRaId } from '../../providers/feeProvider'
const validateUserCreation = (values) => {
  const errors = {};
  if (!values.comment && values.type == 'mobileMoney') {
    errors.comment = 'Veuillez saisir le commentaire pour le payement par mobile money';
  }
  return errors
};
const PaymentCreate = props => {
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
  })

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
      <SimpleForm validate={validateUserCreation}>
        <RadioButtonGroupInput {...props} source='type' label='Type' choices={Object.keys(paymentTypes).map(id => ({ id: id, name: paymentTypes[id].name }))}/>
        <TextInput source='amount' label='Montant du paiement' fullWidth={true} validate={[required(), number(), minValue(1)]} />
        <TextInput source='comment' label='Commentaire' fullWidth={true} />
      </SimpleForm>
    </Create>
  )
}

export default PaymentCreate
