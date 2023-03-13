import { Button, Show, EditButton, TopToolbar, Link, useRecordContext } from 'react-admin'

import { ProfileLayout } from '../profile/ProfileShow'
import { AttachMoney } from '@mui/icons-material'

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

const StudentShow = () => { cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
  const role = authProvider.getCachedRole()
  return (
    <Show title='Étudiants' actions={role === 'MANAGER' && <ActionsOnShow />}>
      <ProfileLayout />
    </Show>
  )
}

export default StudentShow
