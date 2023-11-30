import { useState } from 'react'
import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { FeeSimpleFormContent } from '../fees/FeesCreate'
import { SexRadioButton, turnStringIntoDate } from '../utils'
import { createFees } from './utils'
import { CustomCreate } from '../utils/CustomCreate'

const StudentCreate = props => {
  const [feesConf, setFeesConf] = useState([
    {
      monthlyAmount: null,
      monthsNumber: null,
      comment: null
    }
  ])

  const defaultIsPredefinedType = true
  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)
  const useIsPredefinedType = data => {
    setIsPredefinedType(data)
  }
  const defaultCanCreateFees = false
  const [canCreateFees, setCanCreateFees] = useState(defaultCanCreateFees)
  const transformPayload = payload => {
    const {
      monthly_amount,
      manual_first_duedate,
      is_predefined_first_dueDate,
      predefined_first_dueDate,
      comment,
      months_number,
      manual_type,
      predefined_type,
      is_predefined_type,
      ...student
    } = payload
    const fees = []
    if (canCreateFees) {
      createFees(fees, feesConf, payload, isPredefinedType)
    }
    student.entrance_datetime = turnStringIntoDate(student.entrance_datetime)
    const result = [fees, student]
    return result
  }
  return (
    <CustomCreate title='Étudiants' transform={transformPayload} resource='students'>
      <SimpleForm>
        <TextInput source='ref' label='Référence' fullWidth required />
        <TextInput source='first_name' label='Prénoms' fullWidth required />
        <TextInput source='last_name' label='Nom' fullWidth required />
        <SexRadioButton />
        <TextInput source='phone' label='Téléphone' fullWidth />
        <DateInput source='birth_date' label='Date de naissance' fullWidth />
        <TextInput source='address' label='Adresse' fullWidth multiline data-testid='addressInput' />

        <TextInput source='email' label='Email' fullWidth required />
        <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth required />
        <BooleanInput
          label='Activer la création des frais'
          name='can_create_fees'
          source=''
          defaultValue={defaultCanCreateFees}
          onChange={({ target: { checked } }) => setCanCreateFees(checked)}
        />
        {canCreateFees && <FeeSimpleFormContent passIsPredefinedType={useIsPredefinedType} setFeesConf={setFeesConf} feesConf={feesConf} />}
      </SimpleForm>
    </CustomCreate>
  )
}
export default StudentCreate
