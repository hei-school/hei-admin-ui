import { Menu, MenuItemLink } from 'react-admin'
import Receipt from '@material-ui/icons/Receipt'
import Money from '@material-ui/icons/AttachMoney'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const HaStudentMenu = props => (
  <Menu {...props}>
    <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
    <MenuItemLink replace to='/fees' primaryText='Frais' leftIcon={<Money />} />
    <MenuItemLink replace to='/student-grades' primaryText='Notes' leftIcon={<Receipt />} />
  </Menu>
)

export default HaStudentMenu
