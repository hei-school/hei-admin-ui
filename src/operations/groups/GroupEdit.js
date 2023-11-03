import { useGetList } from 'react-admin'
import { CustomEdit } from '../utils/CustomEdit'
import GroupForm from './GroupForm'

const GroupEdit = () => {
  const queryStudents = useGetList('students')
  const students = queryStudents.data

  return (
    <CustomEdit resource='groups' title='Groupe'>
      <GroupForm students={students} create={false} />
    </CustomEdit>
  )
}
export default GroupEdit
