import { MenuItemCategory, MenuItemList, MenuItemNode, MultiLevelMenu } from '@react-admin/ra-navigation'
import { useNotify } from 'react-admin'

import { AccountCircle, AttachMoney, Info, Inventory, Receipt, School, Work } from '@mui/icons-material'

import authProvider from '../providers/authProvider'
import { CardContent } from '@mui/material'

export const StudentMenu = () => {
  const notify = useNotify()
  const notifyNotImplemented = () => notify('En cours de développement. Ce qui présage quelques exercices pour vous 😉', { type: 'warning' })
  const whoamiId = authProvider.getCachedWhoami().id
  return (
    <MultiLevelMenu variant='categories'>
      <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
      <MenuItemCategory to={whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : '/'} name='fees' label='Frais' icon={<AttachMoney />} />
      <MenuItemCategory to='/' name='student-grades' label='Notes' icon={<Receipt />} onClick={notifyNotImplemented} />
      <MenuItemCategory to='/' name='student-docs' label='Documents' icon={<Inventory />}>
        <MenuItemList>
          <CardContent>
            <MenuItemNode to='/hei-docs' name='hei-docs' label='HEI' icon={<Work />} />
            <MenuItemNode to='/' name='student-infos-docs' label='Vos informations' icon={<Info />} onClick={notifyNotImplemented} />
            <MenuItemNode to='/' name='transcripts' label='Bulletins' icon={<School />} onClick={notifyNotImplemented} />
          </CardContent>
        </MenuItemList>
      </MenuItemCategory>
    </MultiLevelMenu>
  )
}

export default StudentMenu
