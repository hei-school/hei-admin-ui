import { CreateButton, Datagrid, List, TextField, TopToolbar } from 'react-admin'
import { CustomDateField } from '../utils'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)
const ExamList = ({ courseId }) => {
  return (
    <List
      hasCreate
      actions={<Actions basePath={`/courses/${courseId}/exams`} />}
      title=' '
      resource='exams'
      pagination={false}
      filter={{ course_id: courseId }}
      filterDefaultValues={{ course_id: courseId }}
    >
      <Datagrid bulkActionButtons={false} rowClick={examId => `/courses/${courseId}/exams/${examId}/show`}>
        <TextField source='title' label='Détails' />
        <CustomDateField source='examination_date' label='Date' showTime={false} />
        <TextField source='coefficient' label='Coefficient' />
      </Datagrid>
    </List>
  )
}

export default ExamList
