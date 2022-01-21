import { Menu, MenuItemLink } from 'react-admin'
import Receipt from '@material-ui/icons/Receipt'
import Money from '@material-ui/icons/AttachMoney'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const HaStudentMenu = props => {
  const alertNotImplemented = () => alert('En cours de développement. Ce qui présage quelques exercices pour vous ;)')
  return (
    <Menu {...props}>
      <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
      <MenuItemLink replace to='/' primaryText='Frais' leftIcon={<Money />} onClick={alertNotImplemented} />
      <MenuItemLink replace to='/' primaryText='Notes' leftIcon={<Receipt />} onClick={alertNotImplemented} />
    </Menu>
  )
}

export default HaStudentMenu
