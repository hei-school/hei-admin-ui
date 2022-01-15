import { List, Datagrid, TextField, ShowButton } from 'react-admin'
const StudentList = props => (
  <List {...props} label='Etudiants' bulkActionButtons={false}>
    <Datagrid rowClick='edit'>
      <TextField source='ref' />
      <TextField source='first_name' label='Prénoms' />
      <TextField source='last_name' label='Nom' />
      <ShowButton />
    </Datagrid>
  </List>
)

export default StudentList
