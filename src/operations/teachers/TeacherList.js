import { List, Datagrid, TextField, ShowButton, EditButton } from 'react-admin'
import { profileFilters } from '../profile'

const TeacherList = props => (
  <List {...props} bulkActionButtons={false} filters={profileFilters}>
    <Datagrid rowClick='show'>
      <TextField source='ref' />
      <TextField source='first_name' label='Prénoms' />
      <TextField source='last_name' label='Noms' />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
)
export default TeacherList
