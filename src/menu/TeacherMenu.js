import { MultiLevelMenu, MenuItemCategory } from '@react-admin/ra-navigation'

import { AccountCircle, School } from '@mui/icons-material'

export const TeacherMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
    <MenuItemCategory to='/students' name='students' label='Étudiants' icon={<School />} />
  </MultiLevelMenu>
)

export default TeacherMenu
