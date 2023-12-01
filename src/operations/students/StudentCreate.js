import { useState } from 'react'
import { BooleanInput, DateInput, SimpleForm, TextInput } from 'react-admin'
import { SexRadioButton, turnStringIntoDate } from '../utils'
import { createFees } from './utils'
import { CustomCreate } from '../utils/CustomCreate'
import { defaultFeeConf } from '../fees/utils'
import { useCreateFees } from '../../hooks'
import { FeesCreateField } from '../fees/FeesCreateField'

const StudentCreate = () => {
  const [feesConf, setFeesConf] = useState([defaultFeeConf])
  const [canCreateFees, setCanCreateFees] = useState(false)
  const createFeesConf = useCreateFees()
  const { isPredefinedType  } = createFeesConf 
  
  const transformPayload = payload => {
    const fees = []
    if (canCreateFees) {
      createFees(fees, feesConf, payload, isPredefinedType, createFeesConf)
    }
    payload.entrance_datetime = turnStringIntoDate(payload.entrance_datetime)
    return [fees, payload]
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
          defaultValue={false}
          onChange={({ target: { checked } }) => setCanCreateFees(checked)}
        />
        {canCreateFees && <FeesCreateField createFeesConf={createFeesConf} setFeesConf={setFeesConf} feesConf={feesConf} />}
      </SimpleForm>
    </CustomCreate>
  )
}
export default StudentCreate
