import { MultiLevelMenu, MenuItemCategory } from '@react-admin/ra-navigation'

import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SchoolIcon from '@material-ui/icons/School'

export const TeacherMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircleIcon />} />
    <MenuItemCategory to='/students' name='students' label='Étudiants' icon={<SchoolIcon />} />
  </MultiLevelMenu>
)

export default TeacherMenu
