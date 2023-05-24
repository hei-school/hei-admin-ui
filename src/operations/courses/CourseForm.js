import { SimpleForm, TextInput, SelectInput } from 'react-admin'
import teacherProvider from '../../providers/teacherProvider'
import { EditToolBar } from '../utils'
import { useEffect, useState } from 'react'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

const CourseForm = ({ course }) => {
  const role = authProvider.getCachedRole()
  const [teachers, setTeachers] = useState(null)
  useEffect(() => {
    teacherProvider.getList(1, 100, {}).then(res => {
      res && setTeachers(res.map(item => ({ id: item.id, name: item.first_name + ' ' + item.last_name })))
    })
  }, [course])
  return (
    <SimpleForm toolbar={<EditToolBar />}>
      <TextInput source='code' label='Code' fullWidth={true} />
      <TextInput source='name' label='Nom' fullWidth={true} />
      <TextInput source='credits' label='Coefficient' fullWidth={true} />
      <TextInput source='total_hours' label='Heure totale' fullWidth={true} />
      {role === WhoamiRoleEnum.Manager && teachers && <SelectInput source='main_teacher_id' label='Enseignant' fullWidth={true} choices={teachers} />}
    </SimpleForm>
  )
}

export default CourseForm
