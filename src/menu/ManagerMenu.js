import { MultiLevelMenu, MenuItemCategory, MenuItemList, MenuItemNode } from '@react-admin/ra-navigation'
import { CardContent, Typography } from '@mui/material'

import { AccountCircle, School, People, Work, Warning } from '@mui/icons-material'

export const ManagerMenu = () => (
  <MultiLevelMenu variant='categories'>
    <MenuItemCategory to='/profile' name='profile' label='Mon profil' icon={<AccountCircle />} />

    <MenuItemCategory to='/teachers' name='teachers' label='Enseignants' icon={<Work />} />

    <MenuItemCategory name='students' label='Étudiants' icon={<School />}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Opérations sur les étudiants
        </Typography>
        <MenuItemList>
          <MenuItemNode to='/students' name='students' label='Liste des étudiants' icon={<People />} />
          <MenuItemNode to='/fees' name='fees' label='Frais en retard' icon={<Warning />} />
        </MenuItemList>
      </CardContent>
    </MenuItemCategory>
  </MultiLevelMenu>
)

export default ManagerMenu
