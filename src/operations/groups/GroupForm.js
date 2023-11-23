import { SelectArrayInput, SimpleForm, TextInput } from 'react-admin'
import { EditToolBar } from '../utils'

const GroupForm = ({ students, create }) => (
  <SimpleForm toolbar={<EditToolBar />}>
    <TextInput source='ref' label='Référence' required fullWidth />
    <TextInput source='name' label='Nom du groupe' required fullWidth />
    {create && (
      <SelectArrayInput source='students' label='Les étudiants dans ce groupe' choices={students} optionText='ref' fullWidth data-testid='group-students' />
    )}
  </SimpleForm>
)
export default GroupForm
