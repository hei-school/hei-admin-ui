import { SimpleShowLayout, Show, TextField, TopToolbar, EditButton } from 'react-admin'
import ExamList from '../exams/ExamList'
import { useParams } from 'react-router-dom'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

export const CourseLayout = () => {
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

  const courseId = course.id
  const courseName = course.code
  return (
    <Show id={courseId} resource='courses' title={courseName} actions={<ListActions />}>
      <CourseLayout courseId={courseId} />
    </Show>
  )
}

export default CourseShow
