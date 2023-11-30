import { Box, TextField, MenuItem } from '@mui/material'
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

export function DateValueInput({ dateValue, onChange }) {
  const months = Array.from({ length: 12 }, (_, mois) => new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2023, mois, 1)))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        select
        label='Premier mois'
        name='month'
        sx={{ width: '150px' }}
        value={dateValue.month}
        SelectProps={{
          onChange
        }}
      >
        {months.map((el, index) => (
          <MenuItem key={index} value={index}>
            {el[0].toUpperCase() + el.slice(1)}
          </MenuItem>
        ))}
      </TextField>
      <TextField name='year' onChange={onChange} value={dateValue.year} type='number' sx={{ width: '120px' }} label='Année' />
    </Box>
  )
}

export function getLastDay(year, month) {
  const firstNextMonth = new Date(year, month + 1, 1)
  const lastDay = new Date(firstNextMonth - 1)
  return lastDay.getDate()
}
