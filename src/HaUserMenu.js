import React from 'react'
import { useSelector } from 'react-redux'
import { UserMenu } from 'react-admin'

const HaUserMenu = props => {
  const profile = useSelector(state => state.profile)

  return (
    <UserMenu label={profile ? profile.nickname : ''} {...props}>
    </UserMenu>
  )
}

export default HaUserMenu
