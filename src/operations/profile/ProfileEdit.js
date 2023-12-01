import { DateInput, SimpleForm, TextInput } from 'react-admin'

import { EditToolBar, SexRadioButton } from '../utils'
import { CustomEdit } from '../utils/CustomEdit'
import { StatusRadioButton } from '../utils/UserStatusRadioButton'

const ProfileEdit = ({ isOwnProfile }) => (
  <CustomEdit title='Modifier le profil'>
    <SimpleForm toolbar={<EditToolBar />}>
      <TextInput source='ref' label='Référence' fullWidth disabled={isOwnProfile} />
      <TextInput source='first_name' label='Prénom·s' fullWidth />
      <TextInput source='last_name' la bel='Nom·s' fullWidth />
      <TextInput source='email' fullWidth disabled={isOwnProfile} />
      <TextInput multiline source='address' label='Adresse' fullWidth />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth />
      <DateInput source='birth_date' label='Date de naissance' fullWidth />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth disabled={isOwnProfile} />
      <StatusRadioButton disabled={isOwnProfile} />
    </SimpleForm>
  </CustomEdit>
)

export default ProfileEdit
