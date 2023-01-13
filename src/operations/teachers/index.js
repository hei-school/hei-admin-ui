import { Work } from '@mui/icons-material'
import ProfileEdit from '../profile/ProfileEdit'
import TeacherShow from './TeacherShow'
import TeacherList from './TeacherList'
import TeacherCreate from './TeacherCreate'

const teachers = {
  list: TeacherList,
  edit: ProfileEdit,
  show: TeacherShow,
  create: TeacherCreate,
  icon: Work,
  options: { label: 'Enseignants' }
}

export default teachers
