import { FunctionField, ShowButton } from 'react-admin'
import { rowStyle } from './utils'
import { WarningOutlined } from '@mui/icons-material'
import { prettyPrintMoney, statusRenderer, CustomDateField, commentFunctionRenderer } from '../utils'
import { HaList } from '../../ui/haList/HaList'

const ByStatusFeeList = ({ status, ...props }) => {
  return (
    <HaList
      {...props}
      icon={<WarningOutlined />}
      title={`Frais de statut ${statusRenderer(status || 'LATE').toLowerCase()}`}
      resource='fees'
      listProps={{
        filterDefaultValues: { status: status || 'LATE' }
      }}
      filterIndicator={false}
      datagridProps={{
        rowClick: id => `/fees/${id}/show`, 
        rowStyle
      }}
    >
      <CustomDateField source='due_datetime' label='Date limite' showTime={false} />
      <FunctionField source='comment' render={commentFunctionRenderer} label='Commentaire' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
      <ShowButton basePath='/fees' />
    </HaList>
  )
}

export default ByStatusFeeList
