import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, FunctionField, TopToolbar, CreateButton } from 'react-admin'
import { prettyPrintMoney, paymentTypeRenderer, CustomDateField } from '../utils'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const PaymentList = ({ feeId }) => {
  const role = authProvider.getCachedRole()
  return (
    <List
      title=' ' // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
      resource={'payments'}
      actions={role === WhoamiRoleEnum.Manager && <Actions basePath={`/fees/${feeId}/payments`} />}
      filterDefaultValues={{ feeId: feeId }}
      pagination={false}
    >
      <Datagrid bulkActionButtons={false}>
        <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Type' render={record => paymentTypeRenderer(record.type)?.name || '-'} />
        <FunctionField label='Montant' render={record => prettyPrintMoney(record.amount)} textAlign='right' />
      </Datagrid>
    </List>
  )
}

export default PaymentList
