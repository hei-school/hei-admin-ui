import { CreateButton, Datagrid, List, TextField, TopToolbar } from 'react-admin'
import { CustomDateField } from '../utils'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)
/*title='Examens'
      resource='exams'
      pagination={false}
      filterDefaultValues={{ course_id: courseId }}
      hasCreate
      actions={<Actions basePath={`/courses/${courseId}/exams`} />}*/
const ExamList = ({ courseId, ...props }) => {
  return (
    <List {...props} hasCreate title=' ' resource='exams' pagination={false} filterDefaultValues={{ course_id: courseId }}>
      <Datagrid bulkActionButtons={false} rowClick={examId => `/courses/${courseId}/exams/${examId}/show`}>
        <TextField source='title' label='Détails' />
        <CustomDateField source='examination_date' label='Date' showTime={false} />
        <TextField source='coefficient' label='Coefficient' />
      </Datagrid>
    </List>
  )
}

export default ExamList
