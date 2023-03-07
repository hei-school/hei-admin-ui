import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, FunctionField, TopToolbar, CreateButton } from 'react-admin'
import { CustomDateField } from '../fees/ByStatusFeeList'
import { prettyPrintMoney } from '../utils'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const PaymentList = ({ feeId }) => (
  <List
    title=' ' // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
    resource={'payments'}
    actions={<Actions basePath={`/fees/${feeId}/payments`} />}
    filterDefaultValues={{ feeId: feeId }}
    pagination={false}
  >
    <Datagrid>
      <CustomDateField source='creation_datetime' label='Date de création' />
      <TextField source='comment' label='Commentaire' />
      <TextField source='type' label='Type' />
      <FunctionField label='Montant' render={record => prettyPrintMoney(record.amount)} textAlign='right' />
    </Datagrid>
  </List>
)

export default PaymentList
