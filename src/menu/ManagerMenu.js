import { MultiLevelMenu, MenuItemCategory, MenuItemList, MenuItemNode } from '@react-admin/ra-navigation'
import { CardContent, Typography } from '@mui/material'

import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SchoolIcon from '@material-ui/icons/School'
import PeopleIcon from '@material-ui/icons/People'
import WorkIcon from '@material-ui/icons/Work'
import WarningIcon from '@material-ui/icons/WarningOutlined'

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
