import { useGetList } from 'react-admin'
import { CustomEdit } from '../utils/CustomEdit'
import GroupForm from './GroupForm'

const GroupEdit = () => {
  const getStudents = useGetList('students')
  const students = getStudents.data

  return (
    <CustomEdit resource='groups' title='Groupe'>
      <GroupForm students={students} create={false} />
    </CustomEdit>
  )
}
export default GroupEdit
