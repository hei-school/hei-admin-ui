import { List, Datagrid, TextField, ShowButton, EditButton } from 'react-admin'
const StudentList = props => {
  const permission = localStorage.getItem('role')
  return (
    <List label='Etudiants' bulkActionButtons={false} {...props}>
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
