import { SelectArrayInput, SimpleForm, TextInput } from 'react-admin'
import { EditToolBar } from '../utils'

const GroupForm = ({ students }) => (
  <SimpleForm toolbar={<EditToolBar />}>
    <TextInput source='ref' label='Référence' required fullWidth />
    <TextInput source='name' label='Nom du groupe' required fullWidth />
    <SelectArrayInput source='students' label='Les étudiants dans ce groupe' choices={students} optionText='ref' fullWidth />
  </SimpleForm>
)
export default GroupForm
