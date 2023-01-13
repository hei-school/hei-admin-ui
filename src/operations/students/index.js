import { School } from '@mui/icons-material'
import ProfileEdit from '../profile/ProfileEdit'
import StudentShow from './StudentShow'
import StudentList from './StudentList'
import StudentCreate from './StudentCreate'

const students = {
  list: StudentList,
  edit: ProfileEdit,
  show: StudentShow,
  create: StudentCreate,
  icon: School,
  options: { label: 'Étudiants' }
}

export default students
