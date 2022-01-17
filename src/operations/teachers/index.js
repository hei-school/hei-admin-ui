import WorkIcon from '@material-ui/icons/Work'
import TeacherEdit from './TeacherEdit'
import TeacherShow from './TeacherShow'
import TeacherList from './TeacherList'
import TeacherCreate from './TeacherCreate'

const teachers = {
  list: TeacherList,
  edit: TeacherEdit,
  show: TeacherShow,
  create: TeacherCreate,
  icon: WorkIcon,
  options: { label: 'Enseignants' }
}

export default teachers
