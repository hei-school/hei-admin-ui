import { List, Datagrid, TextField, EditButton } from 'react-admin'

import { profileFilters } from '../profile'
import PrevNextPagination, { pageSize } from '../utils/PrevNextPagination'

const TeacherList = () => (
  <List bulkActionButtons={false} filters={profileFilters} pagination={<PrevNextPagination />} perPage={pageSize} resource={'teachers'}>
    <Datagrid rowClick='show'>
      <TextField source='ref' label='Rérérence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      <EditButton />
    </Datagrid>
  </List>
)
export default TeacherList
