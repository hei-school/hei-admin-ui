import SchoolIcon from '@material-ui/icons/School'
import { ListGuesser, EditGuesser } from 'react-admin'
import StudentShow from './StudentShow'

// TODO: student groups are managed here
const students = {
  list: ListGuesser,
  edit: EditGuesser,
  show: StudentShow,
  icon: SchoolIcon,
  options: { label: '(M) Etudiants' }
}

export default students
