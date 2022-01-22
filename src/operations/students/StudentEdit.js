import { Edit, TextInput, FormTab, TabbedForm, DateInput, BooleanInput } from 'react-admin'
import EditToolbar from '../../utils/EditToolBar'

const StudentEdit = props => (
  <Edit title='Étudiants' {...props}>
    <TabbedForm toolbar={<EditToolbar />}>
      <FormTab label='Informations personnelles'>
        <TextInput source='first_name' label='Prénoms' />
        <TextInput source='last_name' label='Nom' />
        <TextInput source='sex' label='Sexe' />
        <DateInput source='birth_date' label='Date de naissance' />
        <TextInput source='address' label='Adresse' />
        <TextInput source='email' label='email' />
      </FormTab>
      <FormTab label='Informations internes'>
        <BooleanInput source='status' label='Accès étudiant' />
      </FormTab>
    </TabbedForm>
  </Edit>
)
export default StudentEdit
