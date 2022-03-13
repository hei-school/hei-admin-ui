import { Button, Show, EditButton, TopToolbar, Link } from 'react-admin'
import { ProfileLayout } from '../profile/ProfileShow'
import Money from '@material-ui/icons/AttachMoney'

const ActionsOnShow = ({ basePath, data, resource }) => {
  return (
    <TopToolbar>
      <EditButton basePath={basePath} resource={resource} record={data} />
      <Button label='Frais' aria-label='fees' component={Link} to={`/students/${data.id}/fees`}>
        <Money />
      </Button>
    </TopToolbar>
  )
}

const StudentShow = props => (
  <Show title='Étudiants' {...props} actions={<ActionsOnShow />}>
    <ProfileLayout />
  </Show>
)

export default StudentShow
