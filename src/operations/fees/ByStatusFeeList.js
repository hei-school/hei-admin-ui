import { List, Datagrid, TextField, DateField, FunctionField, ShowButton } from 'react-admin'
import rowStyle from './byStatusRowStyle'

import { prettyPrintMoney, statusRenderer, CustomDateField, commentFunctionRenderer } from '../utils'

import { maxPageSize } from '../../providers/dataProvider'

const ByStatusFeeList = ({ status, ...props }) => {
  status = status ? status : 'LATE'
  return (
    <List
      {...props}
      title={`Frais de statut ${statusRenderer(status).toLowerCase()}`}
      resource='fees'
      basePath={`/fees`}
      label='Frais'
      actions={null}
      filterDefaultValues={{ status: status }}
      bulkActionButtons={false}
      pagination={false}
      perPage={maxPageSize}
    >
      <Datagrid bulkActionButtons={false} rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
        <CustomDateField source='due_datetime' label='Date limite' showTime={false} />
        <FunctionField source='comment' render={commentFunctionRenderer} label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
        <ShowButton basePath='/fees' />
      </Datagrid>
    </List>
  )
}

export default ByStatusFeeList
