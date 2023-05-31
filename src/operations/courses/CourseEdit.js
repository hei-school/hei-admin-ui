import { Edit, SelectInput, SimpleForm, TextInput, useRecordContext } from 'react-admin'
import { useEffect, useState } from 'react'
import teacherProvider from '../../providers/teacherProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'
import { EditToolBar } from '../utils'
import authProvider from '../../providers/authProvider'
import CourseForm from './CourseForm'

const CourseEdit = () => {
  const [course, setCourse] = useState(null)
  const role = authProvider.getCachedRole()
  const [teachers, setTeachers] = useState(null)
  const AddCourse = () => {
    const record = useRecordContext()
    if (!record) return null
    return <>{setCourse(record)}</>
  }
  const courseTransform = ({ code, name, credits, total_hours, main_teacher_id }) => {
    return { id: course.id, code, name, credits, total_hours, main_teacher_id: main_teacher_id }
  }
  const optionRenderer = teachers => `${teachers.first_name} ${teachers.last_name}`
  useEffect(() => {
    teacherProvider.getList(1, 100, {}).then(res => {
      res && setTeachers(res)
    })
  }, [course])
  return (
    <Edit title='Cours' redirect='list' transform={courseTransform} resource={'courses'}>
      <AddCourse />
      <SimpleForm toolbar={<EditToolBar />}>
        <CourseForm />
        {role === WhoamiRoleEnum.Manager && teachers && (
          <SelectInput
            source='main_teacher_id'
            label='Enseignant'
            fullWidth={true}
            choices={teachers}
            optionText={optionRenderer}
            optionValue='id'
            resettable
            defaultValue={course ? course.main_teacher.id : 1}
          />
        )}
      </SimpleForm>
    </Edit>
  )
}

export default CourseEdit
