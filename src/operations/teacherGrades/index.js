import Receipt from '@material-ui/icons/Receipt'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

// TODO: teacher's availabilities are included here
const teacherGrades = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Receipt,
  options: { label: '(T) Notes' }
}

export default teacherGrades
