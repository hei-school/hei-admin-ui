import { useEffect, useState } from 'react'

import { Edit, SelectInput, SimpleForm, useRecordContext } from 'react-admin'
import { useParams } from 'react-router-dom'

import teacherProvider from '../../providers/teacherProvider'
import { EditToolBar } from '../utils'
import CourseForm from './CourseForm'

const CourseSimpleForm = () => {
  const record = useRecordContext()
  const [course, _setCourse] = useState(record)
  const [defaultTeacherId, setDefaultTeacherId] = useState(1)
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    setDefaultTeacherId(course.main_teacher_id)
    teacherProvider.getList(1, 100, {}).then(res => {
      res && setTeachers(res)
    })
  }, [])

  const optionRenderer = teachers => `${teachers.first_name} ${teachers.last_name}`

  return (
    <SimpleForm toolbar={<EditToolBar />}>
      <CourseForm />
      <SelectInput
        source='main_teacher_id'
        label='Enseignant'
        fullWidth={true}
        choices={teachers}
        optionText={optionRenderer}
        optionValue='id'
        resettable
        defaultValue={defaultTeacherId}
      />
    </SimpleForm>
  )
}
const CourseEdit = () => {
  const params = useParams()
  const courseId = params.id

  const courseTransform = ({ code, name, credits, total_hours, main_teacher_id }) => {
    return { id: courseId, code, name, credits, total_hours, main_teacher_id: main_teacher_id }
  }

  return (
    <Edit title='Cours' redirect='list' transform={courseTransform} resource={'courses'}>
      <CourseSimpleForm />
    </Edit>
  )
}

export default CourseEdit
