import { Edit, SimpleForm, required } from 'react-admin'
import { useLocation, useParams } from 'react-router-dom'
import { EditToolBar } from '../utils'
import { Form } from './utils'

const ExamEdit = () => {
  const params = useParams()
  const courseId = params?.id
  const location = useLocation()

  const validateConditions = [required()]
  const examConfToExamApi = ({ id, title, coefficient, examination_date }) => {
    const examApi = {
      examInfo: [{ id: id, title: title, coefficient: coefficient, examination_date: new Date(examination_date).toISOString() }],
      courseId: courseId
    }
    return [examApi]
  }
  return (
    <Edit transform={examConfToExamApi} redirect={`/courses/${courseId}${location.pathname}/show`}>
      <SimpleForm toolbar={<EditToolBar />}>
        <Form edit={true} />
      </SimpleForm>
    </Edit>
  )
}
export default ExamEdit
