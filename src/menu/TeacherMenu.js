import { MultiLevelMenu, MenuItemCategory } from '@react-admin/ra-navigation'

import { AccountCircle, School, Book } from '@mui/icons-material'

export const TeacherMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
    <MenuItemCategory to='/students' name='students' label='Étudiants' icon={<School />} />
    <MenuItemCategory to='/courses' name='courses' label='Cours' icon={<Book />} />
  </MultiLevelMenu>
)

export default TeacherMenu
