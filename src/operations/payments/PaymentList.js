import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, DateField, FunctionField, TopToolbar, CreateButton } from 'react-admin'

import { prettyPrintMoney } from '../utils/money'
import authProvider from "../../providers/authProvider";

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)
const role = authProvider.getCachedRole()
const PaymentList = ({ feeId }) => (
  <List
    title=' ' // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
    resource={'payments'}
    actions={role === 'MANAGER' ? <Actions basePath={`/fees/${feeId}/payments`} /> : <></>}
    filterDefaultValues={{ feeId: feeId }}
    pagination={false}
  >
    <Datagrid>
      <DateField source='creation_datetime' label='Date de création' />
      <TextField source='comment' label='Commentaire' />
      <TextField source='type' label='Type' />
      <FunctionField label='Montant' render={record => prettyPrintMoney(record.amount)} textAlign='right' />
    </Datagrid>
  </List>
)

export default PaymentList
