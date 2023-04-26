import { useState, useEffect } from 'react'
import { Create, DateInput, required, useDataProvider, SimpleForm, TextInput, NumberInput } from 'react-admin'
import { useParams } from 'react-router-dom'

const ExamCreate = props => {
  const [courseName, setCourseName] = useState('...')
  const validateConditions = [required()]
  const params = useParams()
  const courseId = params.courseId
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const course = await dataProvider.getOne('courses', { id: courseId })
      setCourseName(course.data.code)
    }
    doEffect()
  })
  const examConfToExamApi = ({ title, coefficient, examination_date }) => {
    return [{ exam_info: [{ title: title, coefficient: coefficient, examination_date: examination_date }], course_id: courseId }]
  }
  return (
    <Create {...props} title={`Examen du cours de ${courseName}`} resource='exams' redirect={(_basePath, _id, _data) => `/exams`} transform={examConfToExamApi}>
      <SimpleForm>
        <TextInput source='title' label='Nom' fullWidth={true} validate={validateConditions} />
        <NumberInput source='coefficient' label='Coefficient' min={1} fullWidth={true} validate={validateConditions} />
        <DateInput source='examination_date' label="Date de l'examen" fullWidth={true} validate={validateConditions} />
      </SimpleForm>
    </Create>
  )
}
export default ExamCreate
