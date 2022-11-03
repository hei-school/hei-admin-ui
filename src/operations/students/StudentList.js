import { List } from '@react-admin/ra-rbac'
import { TextField, Datagrid, ShowButton, EditButton } from 'react-admin'

import authProvider from '../../providers/authProvider'

import { profileFilters } from '../profile'
import PrevNextPagination from '../utils/PrevNextPagination'

const StudentList = props => {
  const role = authProvider.getCachedRole()
  return (
    <List {...props} label='Étudiants' bulkActionButtons={false} filters={profileFilters} pagination={<PrevNextPagination />}>
      <Datagrid rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        {role === 'MANAGER' ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
