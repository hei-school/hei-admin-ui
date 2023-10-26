import { CustomCreate } from '../utils/CustomCreate'
import { useGetList, Create } from 'react-admin'
import GroupForm from './GroupForm'

const GroupCreate = () => {
  const getStudents = useGetList('students')
  const students = getStudents.data
  return (
    <CustomCreate resource='groups'>
      <GroupForm students={students} />
    </CustomCreate>
  )
}
export default GroupCreate
