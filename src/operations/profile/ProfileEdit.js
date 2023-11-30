import { SimpleForm, TextInput, DateInput } from 'react-admin'

import { SexRadioButton, EditToolBar, turnStringIntoDate } from '../utils'
import { CustomEdit } from '../utils/CustomEdit'
import { StatusRadioButton } from '../utils/UserStatusRadioButton'

const transformUser = user => {
  let regex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/i // format 2023-02-28T21:00:00.00Z
  let regex2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\Z/i // 2023-02-28T21:00:00Z
  let condition = !regex.test(user.entrance_datetime) && !regex2.test(user.entrance_datetime)
  user.entrance_datetime = condition ? turnStringIntoDate(user.entrance_datetime) : user.entrance_datetime
  return user
}

const ProfileEdit = () => (
  <CustomEdit transform={transformUser}>
    <SimpleForm toolbar={<EditToolBar />}>
      <TextInput source='ref' label='Référence' fullWidth />
      <TextInput source='first_name' label='Prénom·s' fullWidth />
      <TextInput source='last_name' label='Nom·s' fullWidth />
      <TextInput source='email' fullWidth />
      <TextInput multiline source='address' label='Adresse' fullWidth />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth />
      <DateInput source='birth_date' label='Date de naissance' fullWidth />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth />
      <StatusRadioButton />
    </SimpleForm>
  </CustomEdit>
)

export default ProfileEdit
