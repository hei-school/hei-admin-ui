import { TextField, Datagrid, ShowButton, EditButton, List, Button, Link, FunctionField } from 'react-admin'

import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'

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
        <FunctionField label={'Relevé de notes'} render={(student) => <LinkedText studentId={student.id} />}/>
        <ShowButton/>
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}



export default StudentList
