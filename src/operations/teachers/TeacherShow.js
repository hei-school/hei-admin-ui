import { Show, TopToolbar, EditButton } from 'react-admin'

import { ProfileLayout } from '../profile/ProfileShow'
import { TitledShow } from '../utils'

const ActionsOnShow = ({ basePath, data, resource }) => {
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
    </TopToolbar>
  )
}

const TeacherShow = () => {
  return (
    <Show actions={<ActionsOnShow />}>
      <TitledShow showCol='ref'>
        <ProfileLayout />
      </TitledShow>
    </Show>
  )
}

export default TeacherShow
