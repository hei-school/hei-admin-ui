import { EditButton, NumberField, Show, SimpleShowLayout, TextField, TopToolbar, useDataProvider } from 'react-admin'

import { CustomDateField } from '../utils'

import { Divider, Typography } from '@mui/material'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import ByExamParticipantsList from '../participants/ByExamParticipantList'

const ExamDetailLayout = ({ courseId, examId }) => {
  return (
    <SimpleShowLayout>
      <TextField label='Nom/Titre' source='title' />
      <CustomDateField label='Date' source='examination_date' showTime={true} />
      <NumberField label='Coefficient' source='coefficient' />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Typography>Participants</Typography>
      <ByExamParticipantsList examId={examId} courseId={courseId} />
    </SimpleShowLayout>
  )
}
const Actions = ({ basePath, data, resource }) => {
  return (
    <TopToolbar>
      <EditButton basePath={basePath} resource={resource} record={data} />
    </TopToolbar>
  )
}

const ExamShow = () => {
  const params = useParams()
  const raExamId = params.examId
  const raCourseId = params.courseId
  const [examName, setExamName] = useState('')
  const dataProvider = useDataProvider()
  useEffect(() => {
    async function doEffect() {
      const exam = await dataProvider.getOne('exams', { id: raExamId })
      setExamName(exam.data.title)
    }
    doEffect()
  }, [])

  const role = authProvider.getCachedRole()
  return (
    <Show
      id={raExamId}
      actions={role === WhoamiRoleEnum.Manager && <Actions basePath={`/courses/${raCourseId}/exams/${raExamId}/edit`} />}
      title={`Examen : ${examName}`}
      resource='exams'
    >
      <ExamDetailLayout examId={raExamId} courseId={raCourseId} />
    </Show>
  )
}

export default ExamShow
