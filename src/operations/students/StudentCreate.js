import { Create, SimpleForm, TextInput, DateTimeInput, DateInput } from 'react-admin'
import SexRadioButton from '../utils/SexRadioButton'

const StudentCreate = props => (
  <Create {...props} title='Étudiants'>
    <SimpleForm>
      <TextInput source='ref' label='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénoms' fullWidth={true} />
      <TextInput source='last_name' label='Nom' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <TextInput source='address' label='Adresse' fullWidth={true} multiline />
      <TextInput source='email' label='Email' fullWidth={true} />
      <DateTimeInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
    </SimpleForm>
  </Create>
)

export default StudentCreate
