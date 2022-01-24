import React from 'react'
import { connect } from 'react-redux'
import { Menu, MenuItemLink, showNotification } from 'react-admin'
import Receipt from '@material-ui/icons/Receipt'
import Money from '@material-ui/icons/AttachMoney'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export const HaStudentMenu = connect(undefined, { showNotification })(props => {
  const notifyNotImplemented = () => props.showNotification('En cours de développement. Ce qui présage quelques exercices pour vous 😉')
  return (
    <Menu {...props}>
      <MenuItemLink replace to='/profile' primaryText='Mon profil' leftIcon={<AccountCircleIcon />} />
      <MenuItemLink replace to='/' primaryText='Frais' leftIcon={<Money />} onClick={notifyNotImplemented} />
      <MenuItemLink replace to='/' primaryText='Notes' leftIcon={<Receipt />} onClick={notifyNotImplemented} />
    </Menu>
  )
})

export default HaStudentMenu
