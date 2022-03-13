import { SimpleForm, TextInput, DateInput, BooleanInput, Edit } from 'react-admin'
import EditToolbar from '../utils/EditToolBar'
import SexRadioButton from '../utils/SexRadioButton'

const ProfileEdit = props => (
  <Edit {...props}>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source='ref' label='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénom·s' fullWidth={true} />
      <TextInput source='last_name' label='Nom·s' fullWidth={true} />
      <TextInput source='email' fullWidth={true} />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
      <BooleanInput source='status' label='Actif·ve ?' fullWidth={true} />
    </SimpleForm>
  </Edit>
)

export default ProfileEdit
