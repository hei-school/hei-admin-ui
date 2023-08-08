import { MenuItemCategory as Item } from '@react-admin/ra-navigation'
import { useNotify } from 'react-admin'

import { AccountCircleOutlined, AttachMoneyOutlined, ReceiptOutlined } from '@mui/icons-material'
import { HaMenuListContainer } from './HaMenu'

import authProvider from '../providers/authProvider'

export const StudentMenu = () => {
  const notify = useNotify()

  const notifyNotImplemented = () => notify('En cours de développement. Ce qui présage quelques exercices pour vous 😉', { type: 'warning' })

  const whoamiId = authProvider.getCachedWhoami().id

  return (
    <HaMenuListContainer>
      <Item to='/profile' name='profile' label='Mon profil' icon={<AccountCircleOutlined />} sx={{ flexDirection: 'row' }} />
      <Item to={whoamiId ? `/students/${whoamiId}/fees` : '/'} name='fees' label='Frais' icon={<AttachMoneyOutlined />} />
      <Item to='/' name='student-grades' label='Notes' icon={<ReceiptOutlined />} onClick={notifyNotImplemented} />
    </HaMenuListContainer>
  )
}

export default StudentMenu
