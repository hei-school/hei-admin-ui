import { SimpleShowLayout, Show, TextField, TopToolbar, EditButton } from 'react-admin'
import ExamList from '../exams/ExamList'
import { useParams } from 'react-router-dom'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'
import { useEffect, useState } from 'react'

export const CourseLayout = ({ courseId }) => {
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

const CourseShow = () => {
  const role = authProvider.getCachedRole()
  const params = useParams()
  const courseId = params.id
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
    <Show resource='courses' title={'Cours/'} actions={<ListActions />}>
      <CourseLayout courseId={courseId} />
    </Show>
  )
}

export default CourseShow
