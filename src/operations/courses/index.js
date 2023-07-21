import { TextInput } from 'react-admin'

import { Book } from '@mui/icons-material'

import CourseCreate from './CourseCreate'
import CourseEdit from './CourseEdit'
import CourseList from './CourseList'
import CourseShow from './CourseShow'

const courses = {
  list: CourseList,
  show: CourseShow,
  edit: CourseEdit,
  create: CourseCreate,
  icon: Book,
  options: { label: 'Cours' }
}

export const coursesFilters = [
  <TextInput source='code' label='Code' alwaysOn />,
  <TextInput source='name' label='Nom' />,
  <TextInput source='teacherFirstName' label="Prénoms de l'enseignant" />,
  <TextInput source='teacherLastName' label="Nom de l'enseignant" />
]

export default courses
