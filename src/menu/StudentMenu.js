import { MultiLevelMenu, MenuItemCategory } from '@react-admin/ra-navigation'
import { useNotify } from 'react-admin'

import { Receipt, AttachMoney, AccountCircle } from '@mui/icons-material'

import authProvider from '../providers/authProvider'

export const StudentMenu = () => {
  const notify = useNotify()
  const notifyNotImplemented = () => notify('En cours de développement. Ce qui présage quelques exercices pour vous 😉', { type: 'warning' })
  const whoamiId = authProvider.getCachedWhoami().id
  return (
    <MultiLevelMenu variant='categories'>
      <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
      <MenuItemCategory to={whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : '/'} name='fees' label='Frais' icon={<AttachMoney />} />
      {<MenuItemCategory to={whoamiId ? `/grades/${authProvider.getCachedWhoami().id}` : '/'} name='grades' label='Notes' icon={<Receipt />} />}
    </MultiLevelMenu>
  )
}

export default StudentMenu
