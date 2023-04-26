import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, TopToolbar, CreateButton } from 'react-admin'
import { CustomDateField } from '../utils'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const ExamList = ({ courseId }) => {
  const role = authProvider.getCachedRole()
  return (
    <List
      title=' ' // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
      resource={'exams'}
      hasCreate={role === WhoamiRoleEnum.Manager}
      actions={role === WhoamiRoleEnum.Manager && <Actions basePath={`/courses/${courseId}/exams`} />}
      pagination={false}
      filterDefaultValues={{ courseId: courseId }}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='details' label='Détails' />
        <CustomDateField source='examination_date' label='Date' showTime={false} />
        <TextField source='type' label='Type' />
      </Datagrid>
    </List>
  )
}

export default ExamList
