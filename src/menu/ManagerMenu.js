import { Menu, MenuItemLink } from 'react-admin'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SchoolIcon from '@material-ui/icons/School'
import WorkIcon from '@material-ui/icons/Work'
import WarningIcon from '@material-ui/icons/WarningOutlined'

export const ManagerMenu = props => (
  <Menu {...props}>
    <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
    <MenuItemLink replace to='/students' primaryText='Étudiants' leftIcon={<SchoolIcon />} />
    <MenuItemLink replace to='/teachers' primaryText='Enseignants' leftIcon={<WorkIcon />} />
    <MenuItemLink replace to='/fees' primaryText='Frais en retard' leftIcon={<WarningIcon />} />
  </Menu>
)

export default ManagerMenu
