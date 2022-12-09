import { Work } from '@mui/icons-material'
import ProfileEdit from '../profile/ProfileEdit'
import TeacherShow from './TeacherShow'
import TeacherList from './TeacherList'
import TeacherCreate from './TeacherCreate'

const teachers = {
  list: TeacherList,
  edit: props => <ProfileEdit {...props} title='Enseignants' />,
  show: TeacherShow,
  create: TeacherCreate,
  icon: Work,
  options: { label: 'Enseignants' }
}

export default teachers
