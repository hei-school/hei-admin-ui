import { SimpleForm, TextInput, DateInput, Edit } from 'react-admin'
const TeacherEdit = props => (
  <Edit {...props}>
    <SimpleForm>
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
