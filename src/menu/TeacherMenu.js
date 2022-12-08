import { MultiLevelMenu, MenuItemCategory } from '@react-admin/ra-navigation'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SchoolIcon from '@mui/icons-material/School'

export const TeacherMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircleIcon />} />
    <MenuItemCategory to='/students' name='students' label='Étudiants' icon={<SchoolIcon />} />
  </MultiLevelMenu>
)

export default TeacherMenu
