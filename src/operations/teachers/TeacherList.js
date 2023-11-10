import { List, Datagrid, TextField, EditButton } from 'react-admin'
import { HaList } from '../../ui/haList'
import { WorkOutlined } from '@mui/icons-material'
import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'

const HaTeacherList = () => (
  <List filters={profileFilters} pagination={<PrevNextPagination />} perPage={pageSize} resource={'teachers'}>
    <Datagrid bulkActionButtons={false} rowClick='show'>
      <EditButton />
    </Datagrid>
  </List>
)
export default TeacherList

export function TeacherList(){
  return (
    <HaList
      icon={<WorkOutlined />}
      title='Listes des enseignants'
      datagridProps={{ bulkActionButtons: false, rowClick: 'show'}}
    >
      <TextField source='ref' label='Rérérence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      <EditButton />
    </HaList>
  )
}
