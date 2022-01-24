import React from 'react'
import { Show } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'

const TeacherShow = props => {
  return (
    <Show title='Enseignants' {...props}>
      <ProfileLayout />
    </Show>
  )
}

export default TeacherShow
