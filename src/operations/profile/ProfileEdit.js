import { SimpleForm, TextInput, DateInput, RadioButtonGroupInput, Edit } from 'react-admin'

import { SexRadioButton, EditToolBar } from '../utils'

const StatusRadioButton = () => (
  <RadioButtonGroupInput
    source='status'
    label='Statut'
    choices={[
      { id: 'ENABLED', name: 'Actif·ve' },
      { id: 'DISABLED', name: 'Inactif·ve' }
    ]}
  />
)
const transformUser = user => {
  user.entrance_datetime = user.entrance_datetime.concat('T21:00:00.000Z')
  return user
}

const ProfileEdit = () => (
  <Edit transform={transformUser}>
    <SimpleForm toolbar={<EditToolBar />}>
      <TextInput source='ref' label='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénom·s' fullWidth={true} />
      <TextInput source='last_name' label='Nom·s' fullWidth={true} />
      <TextInput source='email' fullWidth={true} />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
      <StatusRadioButton />
    </SimpleForm>
  </Edit>
)

export default ProfileEdit
