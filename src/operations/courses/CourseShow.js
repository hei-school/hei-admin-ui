import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'

export const ProfileLayout = () => {
  return (
    <SimpleShowLayout>
      <TextField source='code' label='code' />
      <TextField source='name' label='name' />
      <TextField source='credits' label='Coéfficient' />
      <TextField source='total_hours' label='heure total' />
    </SimpleShowLayout>
  )
}

const CourseShow = course => {
  const courseId = course.id
  const courseName = course.code
  return (
    <Show id={courseId} resource='courses' basePath={`/fees/${courseId}/show`} title={courseName}>
      <ProfileLayout />
    </Show>
  )
}

export default CourseShow
