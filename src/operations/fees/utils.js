import { Datagrid, FunctionField, ShowButton } from 'react-admin'
import { prettyPrintMoney, CustomDateField, commentFunctionRenderer } from '../utils'
import rowStyle from './byStatusRowStyle'

export const FeesListItems = () => {
  return (
    <Datagrid bulkActionButtons={false} rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
      <CustomDateField source='due_datetime' label='Date limite' showTime={false} />
      <FunctionField source='comment' render={commentFunctionRenderer} label='Commentaire' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
      <ShowButton basePath='/fees' />
    </Datagrid>
  )
}
