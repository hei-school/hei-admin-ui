import { Create, SimpleForm, TextInput, DateInput } from 'react-admin'
import { SexRadioButton, turnStringIntoDate } from '../utils'
import { CustomCreate } from '../utils/CustomCreate'

const transformTeacher = teacher => {
  teacher.entrance_datetime = turnStringIntoDate(teacher.entrance_datetime)
  return teacher
}
const TeacherCreate = () => (
  <CustomCreate title='Enseignants' transform={transformTeacher}>
    <SimpleForm>
      <TextInput source='ref' label='Référence' fullWidth />
      <TextInput source='first_name' label='Prénoms' fullWidth />
      <TextInput source='last_name' label='Nom' fullWidth />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth />
      <DateInput source='birth_date' label='Date de naissance' fullWidth />
      <TextInput multiline source='address' label='Adresse' fullWidth />
      <TextInput source='email' label='Email' fullWidth />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth />
    </SimpleForm>
  </CustomCreate>
)
export default TeacherCreate
