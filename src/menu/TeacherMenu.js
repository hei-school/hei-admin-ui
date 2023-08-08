import { MenuItemCategory as Item } from '@react-admin/ra-navigation'

import { AccountCircle, School } from '@mui/icons-material'
import { HaMenuListContainer } from './HaMenu'

export const TeacherMenu = () => (
  <HaMenuListContainer variant='categories'>
    <Item to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />
    <Item to='/students' name='students' label='Étudiants' icon={<School />} />
  </HaMenuListContainer>
)

export default TeacherMenu
