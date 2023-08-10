import { TextField, Datagrid, ShowButton, EditButton, List, FunctionField } from 'react-admin'
import { Button } from "@mui/material";
import { NoteOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'

const TranscriptLink = ({ studentId }) => {
  return (
    <Button variant='text' startIcon={<NoteOutlined />} component={Link} to={`/students/${studentId}/transcripts`} size="small">
      Relevé
    </Button>
  )
}

const StudentList = () => {
  const role = authProvider.getCachedRole()

  const LinkedText = ({studentId}) => {
    return (
      <Link to={`/students/${studentId}/transcripts/`}>Relevé de notes</Link>
    )
  }

  return (
    <List label='Étudiants' hasCreate={role === WhoamiRoleEnum.Manager} filters={profileFilters} perPage={pageSize} pagination={<PrevNextPagination />}>
      <Datagrid bulkActionButtons={false}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <FunctionField label='Relevé de notes' render={student => <TranscriptLink studentId={student.id} />} />
        <ShowButton />
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}



export default StudentList
