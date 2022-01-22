import { List, Datagrid, TextField, ShowButton, EditButton } from 'react-admin'
import { profileFilters } from '../profile'

const StudentList = props => {
  const permission = localStorage.getItem('role')
  return (
    <List label='Étudiants' bulkActionButtons={false} {...props} filters={profileFilters}>
      <Datagrid rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <ShowButton />
        {permission === 'MANAGER' && <EditButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
