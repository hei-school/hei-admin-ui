import WorkIcon from '@material-ui/icons/Work'
import TeacherEdit from './TeacherEdit'
import TeacherShow from './TeacherShow'
import TeacherList from './TeacherList'

const teachers = {
  list: TeacherList,
  edit: TeacherEdit,
  show: TeacherShow,
  icon: WorkIcon,
  options: { label: 'Enseignants' }
}

export default teachers
