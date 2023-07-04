import { FunctionField, List, TextField } from 'react-admin'

import GradeExamEdit from '../exams/GradeExamEdit'

import { EditableDatagrid } from '@react-admin/ra-editable-datagrid'

const ByExamParticipantsList = ({ courseId, examId, ...props }) => {
  return (
    <List {...props} title=' ' resource='participants' pagination={false} filterDefaultValues={{ course_id: courseId, exam_id: examId }}>
      <EditableDatagrid bulkActionButtons={false} size='small' editForm={<GradeExamEdit />}>
        <TextField label='Identifiant' source='id' />
        <TextField label='Email' source='email' />
        <FunctionField label='Note' source='grade' render={record => record.grade.score} />
      </EditableDatagrid>
    </List>
  )
}
export default ByExamParticipantsList
