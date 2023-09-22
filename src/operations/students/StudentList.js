import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar } from 'react-admin'

import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'
import { ImportButton } from './utils'

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
    <ImportButton />
  </TopToolbar>
)
const StudentList = () => {
  const role = authProvider.getCachedRole()
  return (
    <List
      label='Étudiants'
      hasCreate={role === WhoamiRoleEnum.Manager}
      actions={<ListActions />}
      filters={profileFilters}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
      <Datagrid bulkActionButtons={false} rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
