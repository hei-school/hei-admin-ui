import React from 'react'
import { AppBar } from 'react-admin'
import HaUserMenu from './HaUserMenu'

const HaAppBar = props => <AppBar {...props} userMenu={<HaUserMenu />} />
export default HaAppBar
