import WorkIcon from '@mui/icons-material/Work'
import ProfileEdit from '../profile/ProfileEdit'
import TeacherShow from './TeacherShow'
import TeacherList from './TeacherList'
import TeacherCreate from './TeacherCreate'

const teachers = {
  list: TeacherList,
  edit: props => <ProfileEdit {...props} title='Enseignants' />,
  show: TeacherShow,
  create: TeacherCreate,
  icon: WorkIcon,
  options: { label: 'Enseignants' }
}

export default teachers
