import SchoolIcon from '@material-ui/icons/School'
import ProfileEdit from '../profile/ProfileEdit'
import StudentShow from './StudentShow'
import StudentList from './StudentList'
import StudentCreate from './StudentCreate'

const students = {
  list: StudentList,
  edit: props => <ProfileEdit {...props} title='Étudiants' />,
  show: StudentShow,
  create: StudentCreate,
  icon: SchoolIcon,
  options: { label: 'Étudiants' }
}

export default students
