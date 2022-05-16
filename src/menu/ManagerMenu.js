import { Menu, MenuItemLink } from 'react-admin'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SchoolIcon from '@material-ui/icons/School'
import WorkIcon from '@material-ui/icons/Work'
import WarningIcon from '@material-ui/icons/WarningOutlined'

export const ManagerMenu = props => (
  <Menu {...props}>
    <MenuItemLink to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
    <MenuItemLink to='/teachers' primaryText='Enseignants' leftIcon={<WorkIcon />} />
    <MenuItemLink to='/students' primaryText='Étudiants' leftIcon={<SchoolIcon />} />
    <div style={{ paddingLeft: '37px' }}>
      <MenuItemLink to='/fees' primaryText='Frais en retard' leftIcon={<WarningIcon />} />
    </div>
  </Menu>
)

export default ManagerMenu
