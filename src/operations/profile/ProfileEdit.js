import { SimpleForm, TextInput, DateInput, RadioButtonGroupInput, Edit } from 'react-admin'

import { SexRadioButton, EditToolBar, TurnsStringIntoDate } from '../utils'
import { CustomEdit } from '../utils/CustomEdit'

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
  let regex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/i // format 2023-02-28T21:00:00.00Z
  let regex2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\Z/i // 2023-02-28T21:00:00Z
  let condition = !regex.test(user.entrance_datetime) && !regex2.test(user.entrance_datetime)
  user.entrance_datetime = condition ? TurnsStringIntoDate(user.entrance_datetime) : user.entrance_datetime
  return user
}

const ProfileEdit = () => (
  <CustomEdit transform={transformUser}>
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
  </CustomEdit>
)

export default ProfileEdit
