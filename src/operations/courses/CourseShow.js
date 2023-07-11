import { Divider, Typography } from '@mui/material'
import { EditButton, Show, SimpleShowLayout, TextField, TopToolbar } from 'react-admin'
import { useParams } from 'react-router-dom'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import ExamList from '../exams/ExamList'

export const CourseLayout = ({ courseId }) => {
  return (
    <SimpleShowLayout>
      <TextField source='code' label='code' />
      <TextField source='name' label='Nom' />
      <TextField source='credits' label='Coéfficient' />
      <TextField source='total_hours' label='heure total' />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography>Examens</Typography>
      <ExamList courseId={courseId} />
    </SimpleShowLayout>
  )
}

const CourseShow = () => {
  const params = useParams()
  const courseId = params.id
  const role = authProvider.getCachedRole()
  const ListActions = () => {
    if (role === WhoamiRoleEnum.Manager) {
      return (
        <TopToolbar>
          <EditButton />
        </TopToolbar>
      )
    }
    return <></>
  }
  return (
    <Show id={courseId} resource='courses' title={'Cours/'} actions={<ListActions />}>
      <CourseLayout courseId={courseId} />
    </Show>
  )
}

export default CourseShow
