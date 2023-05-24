import { NumberField, Show, SimpleShowLayout, TextField } from 'react-admin'

import { CustomDateField } from '../utils'

import { Divider, Typography } from '@mui/material'

import { useParams } from 'react-router-dom'
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

const ExamShow = () => {
  const params = useParams()
  const raExamId = params.examId
  const raCourseId = params.courseId
  return (
    <Show id={raExamId} resource='exams' basePath={`/courses/${raCourseId}/exams/${raExamId}/show`}>
      <ExamDetailLayout examId={raExamId} courseId={raCourseId} />
    </Show>
  )
}

export default ExamShow
