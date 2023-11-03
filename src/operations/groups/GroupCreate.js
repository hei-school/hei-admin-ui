import { Create, useGetList } from 'react-admin'
import GroupForm from './GroupForm'

const GroupCreate = () => {
  const queryStudents = useGetList('students')
  const students = queryStudents.data

  return (
    <Create resource='groups'>
      <GroupForm students={students} create />
    </Create>
  )
}
export default GroupCreate
