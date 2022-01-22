import { Menu, MenuItemLink } from 'react-admin'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SchoolIcon from '@material-ui/icons/School'
import WorkIcon from '@material-ui/icons/Work'

export const HaManagerMenu = props => (
  <Menu {...props}>
    <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
    <MenuItemLink replace to='/students' primaryText='Étudiants' leftIcon={<SchoolIcon />} />
    <MenuItemLink replace to='/teachers' primaryText='Enseignants' leftIcon={<WorkIcon />} />
  </Menu>
)

export default HaManagerMenu
