import React from 'react'
import { useSelector } from 'react-redux'
import { UserMenu, MenuItemLink } from 'react-admin'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'

const HaUserMenu = props => {
  const profile = useSelector(state => state.profile)

  return (
    <UserMenu label={profile ? profile.nickname : ''} {...props}>
      <MenuItemLink to='/profile' primaryText='Mon profil' leftIcon={<PermIdentityIcon />} />
    </UserMenu>
  )
}

export default HaUserMenu
