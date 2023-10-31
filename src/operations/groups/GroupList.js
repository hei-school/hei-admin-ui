import { Datagrid, FunctionField, List, ShowButton, TextField } from 'react-admin'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { pageSize, PrevNextPagination } from '../utils'
import { groupFilters } from './index'

const GroupList = () => {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <List title='Liste de groupes' hasCreate={isManager} filters={groupFilters} pagination={<PrevNextPagination />} perPage={pageSize} resource='groups'>
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
