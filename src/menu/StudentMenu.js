import { connect } from 'react-redux'
import { Menu, MenuItemLink, showNotification } from 'react-admin'

import Receipt from '@material-ui/icons/Receipt'
import AttachMoney from '@material-ui/icons/AttachMoney'
import AccountCircle from '@material-ui/icons/AccountCircle'

import authProvider from '../providers/authProvider'

export const StudentMenu = connect(undefined, { showNotification })(props => {
  const notifyNotImplemented = () => props.showNotification('En cours de développement. Ce qui présage quelques exercices pour vous 😉')
  const whoamiId = authProvider.getCachedWhoami().id
  return (
    <Menu {...props}>
      <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircle />} />
      <MenuItemLink replace to={whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : '/'} primaryText='Frais' leftIcon={<AttachMoney />} />
      <MenuItemLink replace to='/' primaryText='Notes' leftIcon={<Receipt />} onClick={notifyNotImplemented} />
    </Menu>
  )
})

export default StudentMenu
