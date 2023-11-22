import {  FunctionField, ShowButton, TextField } from 'react-admin'
import { HaList } from '../../ui/haList'
import { GroupsOutlined } from '@mui/icons-material'
import { WhoamiRoleEnum } from '../../gen/haClient'
import { GroupFilters } from '.'
import authProvider from '../../providers/authProvider'

const GroupList = () => {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <HaList
      listProps={{title: 'Groupes'}}
      resource='groups'
      title='Liste de groupes'
      icon={<GroupsOutlined />}
      actions={<GroupFilters isManager={isManager}/>}
      mainSearch={{source: 'ref', label: 'Référence'}}
    >
      <TextField source='ref' label='Référence' />
      <TextField source='name' label='Nom' />
      <FunctionField source='creation_datetime' render={group => parseInt(group.creation_datetime)} label='Année de création' />
      <ShowButton />
    </HaList>
  )
}

export default GroupList
