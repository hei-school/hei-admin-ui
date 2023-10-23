import { Show, TopToolbar, EditButton } from 'react-admin'

import { ProfileLayout } from '../profile/ProfileShow'

const ActionsOnShow = ({ basePath, data, resource }) => {
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
    </TopToolbar>
  )
}

const TeacherShow = () => {
  return (
    <Show title='Enseignants' actions={<ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default TeacherShow
