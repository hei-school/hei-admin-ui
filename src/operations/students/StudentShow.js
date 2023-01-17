import { Button, Show, EditButton, TopToolbar, Link, useRecordContext } from 'react-admin'

import { ProfileLayout } from '../profile/ProfileShow'
import { AttachMoney } from '@mui/icons-material'

import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

const ActionsOnShow = ({ basePath, data, resource }) => {
  const record = useRecordContext()
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
      {record && (
        <Button label='Frais' aria-label='fees' component={Link} to={`/students/${record.id}/fees`}>
          <AttachMoney />
        </Button>
      )}
    </TopToolbar>
  )
}

const StudentShow = () => {
  const role = authProvider.getCachedRole()
  return (
    <Show title='Étudiants' actions={role === WhoamiRoleEnum.Manager && <ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default StudentShow
