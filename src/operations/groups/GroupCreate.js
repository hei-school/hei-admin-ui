import { CustomCreate } from '../utils/CustomCreate'
import { useGetList, Create } from 'react-admin'
import GroupForm from './GroupForm'

const GroupCreate = () => {
  const getStudents = useGetList('students')
  const students = getStudents.data
  return (
    <Create resource='groups'>
      <GroupForm students={students} create />
    </Create>
  )
}
export default GroupCreate
