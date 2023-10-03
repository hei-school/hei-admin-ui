import { Create, SimpleForm, TextInput, DateInput } from 'react-admin'
import { SexRadioButton, TurnsStringIntoDate } from '../utils'
import { CustomCreate } from '../utils/CustomCreate'

const transformTeacher = teacher => {
  teacher.entrance_datetime = TurnsStringIntoDate(teacher.entrance_datetime)
  return teacher
}
const TeacherCreate = () => (
  <CustomCreate title='Enseignants' transform={transformTeacher}>
    <SimpleForm>
      <TextInput source='ref' label='Référence' fullWidth={true} required />
      <TextInput source='first_name' label='Prénoms' fullWidth={true} />
      <TextInput source='last_name' label='Nom' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} required />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} required />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} required />
      <TextInput source='email' label='Email' fullWidth={true} required />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} required />
    </SimpleForm>
  </CustomCreate>
)
export default TeacherCreate
