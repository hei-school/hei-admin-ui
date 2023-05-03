import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'
import ExamList from '../exams/ExamList'
import { useParams } from 'react-router-dom'

export const ProfileLayout = () => {
  const params = useParams()
  const courseId = params.id
  return (
    <SimpleShowLayout>
      <TextField source='code' label='code' />
      <TextField source='name' label='Nom' />
      <TextField source='credits' label='Coéfficient' />
      <TextField source='total_hours' label='heure total' />
      <ExamList courseId={courseId} />
    </SimpleShowLayout>
  )
}

const CourseShow = course => {
  const courseId = course.id
  const courseName = course.code
  return (
    <Show id={courseId} resource='courses' title={courseName}>
      <ProfileLayout courseId={courseId} />
    </Show>
  )
}

export default CourseShow
