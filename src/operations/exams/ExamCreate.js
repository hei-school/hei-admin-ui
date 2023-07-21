import { useEffect, useState } from 'react'

import { Create, SimpleForm, useDataProvider } from 'react-admin'
import { useParams } from 'react-router-dom'

import { Form } from './utils'

const ExamCreate = props => {
  const dataProvider = useDataProvider()
  const params = useParams()

  const [courseCode, setCourseCode] = useState('...')
  const courseId = params.courseId

  useEffect(() => {
    const doEffect = async () => {
      const course = await dataProvider.getOne('courses', { id: courseId })
      setCourseCode(course.data.code)
    }
    doEffect()
  }, [])

  const examConfToExamApi = ({ title, coefficient, examination_date }) => {
    const examApi = {
      examInfo: [{ title: title, coefficient: coefficient, examination_date: new Date(examination_date).toISOString() }],
      courseId: courseId
    }
    return [examApi]
  }

  return (
    <Create
      {...props}
      title={`Examen du cours de ${courseCode}`}
      resource='exams'
      redirect={(_basePath, _id, _data) => `courses/${courseId}/show`}
      transform={examConfToExamApi}
    >
      <SimpleForm>
        <Form edit={false} />
      </SimpleForm>
    </Create>
  )
}
export default ExamCreate
