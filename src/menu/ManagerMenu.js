import { MultiLevelMenu, MenuItemCategory, MenuItemList, MenuItemNode } from '@react-admin/ra-navigation'
import { CardContent, Typography } from '@mui/material'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import WorkIcon from '@mui/icons-material/Work'
import WarningIcon from '@mui/icons-material/WarningOutlined'

export const ManagerMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircleIcon />} />

    <MenuItemCategory to='/teachers' name='teachers' label='Enseignants' icon={<WorkIcon />} />

    <MenuItemCategory name='students' label='Étudiants' icon={<SchoolIcon />}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Opérations sur les étudiants
        </Typography>
        <MenuItemList>
          <MenuItemNode to='/students' name='students' label='Liste des étudiants' icon={<PeopleIcon />} />
          <MenuItemNode to='/fees' name='fees' label='Frais en retard' icon={<WarningIcon />} />
        </MenuItemList>
      </CardContent>
    </MenuItemCategory>
  </MultiLevelMenu>
)

export default ManagerMenu
