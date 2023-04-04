import { List, Datagrid, TextField, DateField, FunctionField, ShowButton } from 'react-admin'
import rowStyle from './byStatusRowStyle'

import { prettyPrintMoney, statusRenderer, CustomDateField, commentFunctionRenderer } from '../utils'

import { maxPageSize } from '../../providers/dataProvider'
import { FeesListItems } from './utils'

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
      <FeesListItems />
    </List>
  )
}

export default ByStatusFeeList
