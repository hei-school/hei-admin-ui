import Timelapse from '@material-ui/icons/Timelapse'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

//TODO: do not forget to show student's group here
const studentTimetable = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Timelapse,
  options: { label: 'Calendrier' }
}

export default studentTimetable
