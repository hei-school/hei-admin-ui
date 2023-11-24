import { TextField } from '@mui/material'
import useHaToolbarContext from './useHaToolbarContext'

export function TextFilter({ label, source, ...rest }) {
  const { currentFilter, setOneFilter } = useHaToolbarContext()
  return (
    <TextField
      type='text'
      label={label}
      size='small'
      variant='outlined'
      value={currentFilter[source] || ''}
      sx={{ width: '100%', minWidth: '320px' }}
      onChange={event => setOneFilter(source, event.target.value)}
      {...rest}
    />
  )
}
