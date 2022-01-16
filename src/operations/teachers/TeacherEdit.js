import { SimpleForm, TextInput, DateInput, Edit } from 'react-admin'
import EditToolbar from '../../utils/EditToolBar'

const TeacherEdit = props => (
  <Edit title='Enseignants'  {...props}>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source='first_name' label='Prénoms' />
      <TextInput source='last_name' label='Noms' />
      <TextInput source='sex' label='Sexe' />
      <DateInput source='birth_date' label='Date de naissance' />
      <TextInput source='address' label='Adresse' />
      <TextInput source='email' />
      <DateInput source='entrance_datetime' label="Date d'embauche" />
    </SimpleForm>
  </Edit>
)

export default TeacherEdit
