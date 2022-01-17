import { UserMenu, MenuItemLink } from 'react-admin'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
const HaUserMenu = props => {
  return (
    <UserMenu label={'Profil'} {...props}>
      <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<PermIdentityIcon />} />
    </UserMenu>
  )
}

export default HaUserMenu
