import { Create, SimpleForm, SelectInput } from 'react-admin'
import { useEffect, useState } from 'react'
import { WhoamiRoleEnum } from '../../gen/haClient'
import teacherProvider from '../../providers/teacherProvider'
import authProvider from '../../providers/authProvider'
import CourseForm from './CourseForm'

const CourseCreate = () => {
  const role = authProvider.getCachedRole()
  const [teachers, setTeachers] = useState(null)
  const optionRenderer = teachers => `${teachers.first_name} ${teachers.last_name}`
  useEffect(() => {
    teacherProvider.getList(1, 100, {}).then(res => {
      res && setTeachers(res)
    })
  }, [])
  return role === WhoamiRoleEnum.Manager ? (
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
  ) : (
    <></>
  )
}

export default CourseCreate
