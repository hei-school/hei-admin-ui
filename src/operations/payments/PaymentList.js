import { List, Datagrid, TextField, DateField, FunctionField } from 'react-admin'

import authProvider from '../../providers/authProvider'

import { prettyPrintMoney } from '../utils/money'
import PermittedListActions from '../utils/PermittedListActions'

const PaymentList = ({ feeId }) => {
  const permission = authProvider.getCachedRole()
  return (
    <List
      title=' ' // is appended to ContainingComponent.title, default is ContainingComponent.title... so need to set it!
      resource='payments'
      basePath={`/fees/${feeId}/payments`}
      filterDefaultValues={{ feeId: feeId }}
      actions={permission === 'STUDENT' ? null : <PermittedListActions />}
      bulkActionButtons={false}
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
}

export default PaymentList
