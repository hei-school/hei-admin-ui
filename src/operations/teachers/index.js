import WorkIcon from '@material-ui/icons/Work'
import ProfileShow from '../profile/ProfileShow'
import TeacherEdit from './TeacherEdit'
import TeacherList from './TeacherList'
import TeacherCreate from './TeacherCreate'

const teachers = {
  list: TeacherList,
  edit: TeacherEdit,
  show: props => <ProfileShow withChangeRequest={false} {...props} />,
  create: TeacherCreate,
  icon: WorkIcon,
  options: { label: 'Enseignants' }
}

export default teachers
