import Timelapse from '@material-ui/icons/Timelapse'
import { ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'

//TODO: do not forget to show students' groups here
const teacherTimetable = {
  list: ListGuesser,
  edit: EditGuesser,
  show: ShowGuesser,
  icon: Timelapse,
  options: { label: '(T) Calendrier' }
}

export default teacherTimetable
