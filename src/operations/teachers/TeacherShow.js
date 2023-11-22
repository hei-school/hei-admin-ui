import { Show } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'
import { ActionsOnShow } from '../utils'

const TeacherShow = () => {
  return (
    <Show title='Scanners' actions={<ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default TeacherShow
