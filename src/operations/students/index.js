import SchoolIcon from '@material-ui/icons/School'
import ProfileShow from '../profile/ProfileShow'
import StudentList from './StudentList'
import StudentEdit from './StudentEdit'
import StudentCreate from './StudentCreate'
const students = {
  list: StudentList,
  edit: StudentEdit,
  show: props => <ProfileShow withChangeRequest={false} {...props} />,
  create: StudentCreate,
  icon: SchoolIcon,
  options: { label: 'Etudiants' }
}

export default students
