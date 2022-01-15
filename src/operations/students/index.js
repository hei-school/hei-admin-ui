import SchoolIcon from '@material-ui/icons/School'
import StudentShow from './StudentShow'
import StudentList from './StudentList'
import StudentEdit from './StudentEdit'
const students = {
  list: StudentList,
  edit: StudentEdit,
  show: StudentShow,
  icon: SchoolIcon,
  options: { label: 'Etudiants' }
}

export default students
