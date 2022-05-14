import { List, Datagrid, TextField, DateField, FunctionField, ShowButton } from 'react-admin'

import rowStyle from './byStatusRowStyle'
import { prettyPrintMoney } from '../utils/money'

import { maxPageSize } from '../../providers/dataProvider'

const ByStatusFeeList = ({ status, ...props }) => {
  status = status ? status : 'LATE'
  return (
    <List
      {...props}
      title={`Frais de statut ${status}`}
      resource='fees'
      basePath={`/fees`}
      label='Frais'
      actions={null}
      filterDefaultValues={{ status: status }}
      bulkActionButtons={false}
      pagination={false}
      perPage={maxPageSize}
    >
      <Datagrid rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
        <DateField source='due_datetime' label='Date limite' />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <DateField source='creation_datetime' label='Date de création' />
        <ShowButton basePath='/fees' />
      </Datagrid>
    </List>
  )
}

export default ByStatusFeeList
