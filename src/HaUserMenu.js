import React, { Component } from 'react'
import { connect } from 'react-redux'
import { crudGetOne, UserMenu, MenuItemLink } from 'react-admin'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'

class HaUserMenuView extends Component {
  componentDidMount() {
    this.fetchProfile()
  }

  fetchProfile = () => {
    this.props.crudGetOne(
      'profile',
      'my-profile', //TODO(profile-id)
      '/my-profile',
      false
    )
  }

  render() {
    const { profile, ...props } = this.props

    return (
      <UserMenu label={profile ? profile.nickname : ''} {...props}>
        <MenuItemLink to='/profile' primaryText='Mon profil' leftIcon={<PermIdentityIcon />} />
      </UserMenu>
    )
  }
}

const mapStateToProps = state => {
  const resource = 'profile'
  const id = '1' //TODO(profile-id)
  const profileState = state.admin.resources[resource]

  return {
    profile: profileState ? profileState.data[id] : null
  }
}

const HaUserMenu = connect(mapStateToProps, { crudGetOne })(HaUserMenuView)
export default HaUserMenu
