import { Button, Show, EditButton, TopToolbar, Link, useRecordContext } from 'react-admin'

import { ProfileLayout } from '../profile/ProfileShow'
import Money from '@material-ui/icons/AttachMoney'

import authProvider from '../../providers/authProvider'

const ActionsOnShow = ({ basePath, data, resource }) => {
  const record = useRecordContext()
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
      {record && (
        <Button label='Frais' aria-label='fees' component={Link} to={`/students/${record.id}/fees`}>
          <Money />
        </Button>
      )}
    </TopToolbar>
  )
}

const StudentShow = props => {
  const role = authProvider.getCachedRole()
  return (
    <Show title='Étudiants' {...props} actions={role === 'MANAGER' ? <ActionsOnShow /> : null}>
      <ProfileLayout />
    </Show>
  )
}

export default StudentShow
