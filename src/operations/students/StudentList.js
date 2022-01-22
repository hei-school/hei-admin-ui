import { List, Datagrid, TextField, ShowButton, EditButton } from 'react-admin'
import { profileFilters } from '../profile'

const StudentList = props => {
  const permission = localStorage.getItem('role')
  return (
    <List label='Etudiants' bulkActionButtons={false} {...props} filters={profileFilters}>
      <Datagrid rowClick='show'>
        <TextField source='ref' />
        <TextField source='first_name' label='Prénoms' />
        <TextField source='last_name' label='Nom' />
        <ShowButton />
        {permission === 'MANAGER' && <EditButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
