import { TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
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

export const SelectInputFilter = ({ choices, label, source, ...props }) => {
  const { currentFilter, setOneFilter } = useHaToolbarContext()
  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id='select-label' size='small' variant='outlined'>
        {label}
      </InputLabel>
      <Select
        labelId='select-label'
        label={label}
        size='small'
        variant='outlined'
        value={currentFilter[source] || ''}
        sx={{ minWidth: '320px' }}
        fullWidth
        onChange={event => setOneFilter(source, event.target.value)}
        {...props}
      >
        {choices.map(choice => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
