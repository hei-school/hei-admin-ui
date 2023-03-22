import { Button, EditButton, Link, Show, TopToolbar, useRecordContext } from 'react-admin'
import { AttachMoney } from '@mui/icons-material'
import { ProfileLayout } from '../profile/ProfileShow'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'

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
    <Show title='Étudiants' actions={role === WhoamiRoleEnum.MANAGER && <ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default StudentShow
