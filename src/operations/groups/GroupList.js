import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, FunctionField, List, ShowButton, TextField, TopToolbar } from 'react-admin'
import { exporter, importHeaders, pageSize, PrevNextPagination } from '../utils'
import { groupFilters } from './index'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

const GroupList = () => {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <List title='Liste de groupes' filters={groupFilters} pagination={<PrevNextPagination />} hasCreate={isManager} perPage={pageSize} resource='groups'>
      <Datagrid bulkActionButtons={false} rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='name' label='Nom' />
        <FunctionField source='creation_datetime' render={group => parseInt(group.creation_datetime)} label='Année de création' />
        <ShowButton />
      </Datagrid>
    </List>
  )
}

export default GroupList
