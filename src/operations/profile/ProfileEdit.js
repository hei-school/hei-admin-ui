import { SimpleForm, TextInput, DateInput, BooleanInput, Edit } from 'react-admin'
import EditToolbar from '../utils/EditToolBar'

const ProfileEdit = props => (
  <Edit {...props}>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source='first_name' label='Prénom·s' />
      <TextInput source='last_name' label='Nom·s' />
      <TextInput source='email' />
      <TextInput source='address' label='Adresse' />
      <TextInput source='sex' label='Sexe' />
      <DateInput source='birth_date' label='Date de naissance' />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" />
      <BooleanInput source='status' label='Actif·ve ?' />
    </SimpleForm>
  </Edit>
)

export default ProfileEdit
