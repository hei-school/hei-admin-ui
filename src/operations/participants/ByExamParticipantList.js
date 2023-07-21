import { List, TextField } from 'react-admin'

import GradeExamEdit from '../exams/GradeExamEdit'

import { EditableDatagrid } from '@react-admin/ra-editable-datagrid'

const ByExamParticipantsList = ({ courseId, examId, ...props }) => {
  return (
    <List {...props} title=' ' resource='participants' pagination={false} filterDefaultValues={{ course_id: courseId, exam_id: examId }}>
      <EditableDatagrid bulkActionButtons={false} size='small' editForm={<GradeExamEdit />}>
        <TextField label='Identifiant' source='ref' />
        <TextField label='Email' source='email' />
        <TextField label='Note' source='grade.score' />
      </EditableDatagrid>
    </List>
  )
}
export default ByExamParticipantsList
