import { useEffect, useState } from 'react'

import { Create, SelectInput, SimpleForm } from 'react-admin'

import authProvider from '../../providers/authProvider'
import teacherProvider from '../../providers/teacherProvider'
import CourseForm from './CourseForm'

const CourseCreate = () => {
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    teacherProvider.getList(1, 100, {}).then(res => {
      res && setTeachers(res)
    })
  }, [])

  const role = authProvider.getCachedRole()

  const optionRenderer = teachers => `${teachers.first_name} ${teachers.last_name}`

  return (
    <Create title='Cours' redirect='list' resource={'courses'}>
      <SimpleForm>
        <CourseForm />
        {teachers && (
          <SelectInput
            source='main_teacher_id'
            label='Enseignant'
            fullWidth={true}
            choices={teachers}
            optionText={optionRenderer}
            optionValue='id'
            resettable
          />
        )}
      </SimpleForm>
    </Create>
  )
}

export default CourseCreate
