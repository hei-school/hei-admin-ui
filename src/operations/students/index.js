import SchoolIcon from '@material-ui/icons/School'
import StudentShow from './StudentShow'
import StudentList from './StudentList'
import StudentEdit from './StudentEdit'
import StudentCreate from './StudentCreate'
const students = {
  list: StudentList,
  edit: StudentEdit,
  show: StudentShow,
  create: StudentCreate,
  icon: SchoolIcon,
  options: { label: 'Étudiants' }
}

export default students
