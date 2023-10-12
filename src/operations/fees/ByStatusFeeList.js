import { List, Datagrid, TextField, DateField, FunctionField, ShowButton } from 'react-admin'
import rowStyle from './byStatusRowStyle'

import { prettyPrintMoney, statusRenderer, CustomDateField, commentFunctionRenderer } from '../utils'

import { maxPageSize } from '../../providers/dataProvider'
import { FeesListItems } from './utils'
import { TitledPage } from '../utils'

const ByStatusFeeList = ({ status, ...props }) => {
  status = status ? status : 'LATE'
  return (
    <List
      {...props}
      resource='fees'
      basePath={`/fees`}
      label='Frais'
      actions={null}
      filterDefaultValues={{ status: status }}
      bulkActionButtons={false}
      pagination={false}
      perPage={maxPageSize}
    >
      <TitledPage title={`Frais de statut ${statusRenderer(status).toLowerCase()}`}>
        <FeesListItems />
      </TitledPage>
    </List>
  )
}

export default ByStatusFeeList
