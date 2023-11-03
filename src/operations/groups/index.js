import { Groups } from '@mui/icons-material'
import { TextInput } from 'react-admin'
import GroupList from './GroupList'
import GroupShow from './GroupShow'
import GroupCreate from './GroupCreate'
import GroupEdit from './GroupEdit'

const groups = {
  list: GroupList,
  show: GroupShow,
  create: GroupCreate,
  edit: GroupEdit,
  icon: Groups,
  options: { label: 'Groupes' }
}

export const groupFilters = [
  <TextInput source='ref' label='Filtre par référence' />,
  <TextInput source='name' label='Nom' />,
  <TextInput source='creation_datetime' label='Date ou année' />
]
export default groups
