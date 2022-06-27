import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, EditButton } from 'react-admin'

import { profileFilters } from '../profile'
import PrevNextPagination from '../utils/PrevNextPagination'

const TeacherList = () => (
  <List bulkActionButtons={false} filters={profileFilters} pagination={<PrevNextPagination />}>
    <Datagrid rowClick='show'>
      <TextField source='ref' label='Rérérence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      <EditButton />
    </Datagrid>
  </List>
)
export default TeacherList
