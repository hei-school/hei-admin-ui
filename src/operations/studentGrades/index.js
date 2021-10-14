import Receipt from '@material-ui/icons/Receipt'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

const studentGrades = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Receipt,
  options: { label: 'Notes' }
}

export default studentGrades
