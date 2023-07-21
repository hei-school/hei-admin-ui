import { MenuItemCategory, MultiLevelMenu } from '@react-admin/ra-navigation'

import { AccountCircle, AttachMoney, Receipt } from '@mui/icons-material'

import authProvider from '../providers/authProvider'

export const StudentMenu = () => {
  const userId = authProvider.getCachedWhoami().id
  return (
    <MultiLevelMenu variant='categories'>
      <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
      <MenuItemCategory to={`/students/${userId}/fees`} name='fees' label='Frais' icon={<AttachMoney />} />
      <MenuItemCategory to={`/students/grades/${userId}`} name='grades' label='Notes' icon={<Receipt />} />
    </MultiLevelMenu>
  )
}

export default StudentMenu
