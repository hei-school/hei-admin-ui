import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, DateField, FunctionField, TopToolbar, CreateButton } from 'react-admin'

import { prettyPrintMoney } from '../utils/money'

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
      <DateField source='creation_datetime' label='Date de création' locales='fr-FR' options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
      <TextField source='comment' label='Commentaire' />
      <TextField source='type' label='Type' />
      <FunctionField label='Montant' render={record => prettyPrintMoney(record.amount)} textAlign='right' />
    </Datagrid>
  </List>
)

export default PaymentList
