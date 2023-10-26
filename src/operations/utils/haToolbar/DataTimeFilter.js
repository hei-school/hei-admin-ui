import { TextField } from '@mui/material'
import { useContext } from 'react'
import { ToolbarContext } from './AddFilter'

export function DateTimeFilter({ source, label }){
  const { currentFilter, setOneFilter } = useContext(ToolbarContext)
  return (
    <TextField
      size='small'
      type='datetime-local'
      variant='outlined'
      label={label}
      sx={{ width:'100%'}}
      InputLabelProps={{ shrink: true }}
      value={currentFilter[source] || ''}
      onChange={(event)=>setOneFilter(source,event.target.value)}
    />
  )
}

