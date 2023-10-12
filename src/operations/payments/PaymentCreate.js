import { useState, useEffect } from 'react'

import { Create, SimpleForm, TextInput, RadioButtonGroupInput, useDataProvider, required, minValue, number, useNotify } from 'react-admin'
import { useParams } from 'react-router-dom'
import { paymentTypes } from '../../conf'

import { studentIdFromRaId } from '../../providers/feeProvider'

const PaymentCreate = props => {
  const params = useParams()
  const notify = useNotify()
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

  const validateConditions = [required()]
  const [paymentChoice, setPaymentChoice] = useState('cash')
  const paymentConfToPaymentApi = ({ type, amount, comment }) => {
    return [{ feeId: feeId, type: paymentTypes[type].type, amount: amount, comment: comment }]
  }

  return (
    <Create
      mutationOptions={{
        onError: error => {
          notify(`Une erreur s'est produite`, { type: 'error', autoHideDuration: 1000 })
        }
      }}
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
