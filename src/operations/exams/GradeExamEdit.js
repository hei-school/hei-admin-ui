import { TextField, TextInput } from 'react-admin'

import { RowForm } from '@react-admin/ra-editable-datagrid'
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
