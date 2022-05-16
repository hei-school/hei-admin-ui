import { Button, Show, EditButton, TopToolbar, Link } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'
import Money from '@material-ui/icons/AttachMoney'

import authProvider from '../../providers/authProvider'

const ActionsOnShow = ({ basePath, data, resource, studentId }) => {
  return (
    <TopToolbar>
      <EditButton basePath={basePath} resource={resource} record={data} />
      <Button label='Frais' aria-label='fees' component={Link} to={`/students/${studentId}/fees`}>
        <Money />
      </Button>
    </TopToolbar>
  )
}

const StudentShow = props => {
  const permission = authProvider.getCachedRole()
  return (
    <Show title='Étudiants' {...props} actions={permission === 'MANAGER' ? <ActionsOnShow studentId={props.match.params.id} /> : null}>
      <ProfileLayout />
    </Show>
  )
}

export default StudentShow
