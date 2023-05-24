import { Book } from '@mui/icons-material'
import CourseList from './CourseList'
import CourseShow from './CourseShow'
import { TextInput } from 'react-admin'
import CourseEdit from './CourseEdit'
import CourseCreate from './CourseCreate'

const courses = {
  list: CourseList,
  show: CourseShow,
  edit: CourseEdit,
  create: CourseCreate,
  icon: Book,
  options: { label: 'Cours' }
}

export const coursesFilters = [
  <TextInput source='code' label='code' alwaysOn />,
  <TextInput source='name' label='nom' />,
  <TextInput source='teacherFirstName' label='teacherFirstName' />,
  <TextInput source='teacherLastName' label='teacherLastName' />
]

export default courses
