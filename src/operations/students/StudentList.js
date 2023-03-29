import { TextField, Datagrid, ShowButton, EditButton, List } from 'react-admin'

import authProvider from '../../providers/authProvider'

import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'

const StudentList = () => {
  const role = authProvider.getCachedRole()
  return (
    <List
      label='Étudiants'
      bulkActionButtons={false}
      hasCreate={role === 'MANAGER'}
      filters={profileFilters}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
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
