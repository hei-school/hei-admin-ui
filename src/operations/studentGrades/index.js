import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

import Receipt from '@material-ui/icons/Receipt'

const studentGrades = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Receipt,
  options: { label: 'Notes' }
}

export default studentGrades
