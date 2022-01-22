import { List, Datagrid, TextField, ShowButton, EditButton } from 'react-admin'
import { profileFilters } from '../profile'

const TeacherList = props => (
  <List {...props} bulkActionButtons={false} filters={profileFilters}>
    <Datagrid rowClick='show'>
      <TextField source='ref' label='Rérérence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
)
export default TeacherList
