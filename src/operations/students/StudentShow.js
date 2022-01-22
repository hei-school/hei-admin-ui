import { Show } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'

const StudentShow = props => (
  <Show title='Étudiants' {...props}>
    <ProfileLayout />
  </Show>
)

export default StudentShow
