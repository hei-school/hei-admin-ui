import WorkIcon from '@material-ui/icons/Work'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

const teachers = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: WorkIcon,
  options: { label: '(M) Enseignants' }
}

export default teachers
