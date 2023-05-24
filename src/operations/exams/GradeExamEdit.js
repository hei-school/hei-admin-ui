import { RowForm } from '@react-admin/ra-editable-datagrid'
import { TextField, TextInput } from 'react-admin'

const GradeExamEdit = props => {
  return (
    <RowForm>
      <TextField label='Identifiant' source='id' />
      <TextField label='Email' source='email' />
      <TextInput label='Note' source='grade.score' />
    </RowForm>
  )
}
export default GradeExamEdit
