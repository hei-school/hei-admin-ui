import { IconButton, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'
import { Link } from 'react-admin'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/styles'
import { formatDate } from '../../../ui/utils'

const StyledTypography = styled('h3')({
  color: '#484a49',
  fontSize: '1em',
  marginTop: 10,
  marginBottom: 0,
  fontWeight: 600
})

function Title({ content, label, link }) {
  const getContent = link ? <Link to={link}>{content}</Link> : <span style={{ color: '#282829' }}>{content}</span>

  return (
    <Typography sx={{ color: '#4a4b4d', my: 0.4, fontSize: '14px' }}>
      {label}: {getContent}
    </Typography>
  )
}

function ShowOne({ showOne, setShowOne }) {
  const { status, record } = showOne
  if (!record) return null

  const isSession = record.course_session.id
  const awareded_course = isSession ? record.course_session.awareded_course : {}

  const close = () => setShowOne({ status: false, record: null })
  const student = `${record.student.first_name} ${record.student.ref}`
  const teacher = isSession ? `${awareded_course.main_teacher.first_name} ${awareded_course.main_teacher.ref}` : ''

  const data = isSession
    ? [
        { label: 'Group', content: awareded_course.group.ref },
        { label: 'Cours', content: awareded_course.course.code },
        { label: 'Enseignant', link: `/teachers/${awareded_course.main_teacher.id}/show`, content: teacher },
        { label: 'Debut', content: formatDate(record.course_session.begin) },
        { label: 'Fin', content: formatDate(record.course_session.end) }
      ]
    : []

  return (
    <Dialog open={status} onClose={close}>
      <DialogTitle component='div' sx={{ pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '.9em', fontWeight: 'bold', color: '#484a49' }}> Pointage: {record.id} </Typography>
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ minWidth: '300px' }}>
        <StyledTypography>Informations</StyledTypography>
        <Title label='Heure' content={formatDate(record.created_at) || '---'} />
        <Title label='Étudiant' link={`/students/${record.student.id}/show`} content={student} />
        <Title label='Lieu' content={record.place} />
        {isSession && (
          <>
            {record.is_late && <Title label='En retard de' content={record.late_of} />}
            <StyledTypography>Cours</StyledTypography>
            {data.map((el, index) => (
              <Title key={index} {...el} />
            ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ShowOne
