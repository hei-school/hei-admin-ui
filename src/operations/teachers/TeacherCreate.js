import { Create, SimpleForm, TextInput, DateInput } from 'react-admin'
import { SexRadioButton } from '../utils'

const transformTeacher = teacher => {
  teacher.entrance_datetime = teacher.entrance_datetime.concat('T10:00:00.000Z')
  return teacher
}
const TeacherCreate = () => (
  <Create title='Enseignants' transform={transformTeacher}>
    <SimpleForm>
      <TextInput source='ref' label='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénoms' fullWidth={true} />
      <TextInput source='last_name' label='Nom' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} />
      <TextInput source='email' label='Email' fullWidth={true} />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
    </SimpleForm>
  </Create>
)
export default TeacherCreate
