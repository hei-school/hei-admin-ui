import { TextField } from '@mui/material'
import { useContext } from 'react'
import { ToolbarContext } from './FilterForm'

export function DateTimeFilter({ source, label }){
  const { currentFilter, setOneFilter } = useContext(ToolbarContext)
  const value = currentFilter[source] ? currentFilter[source].slice(0,currentFilter[source].lastIndexOf(':')) : ''

  return (
    <TextField
      size='small'
      type='datetime-local'
      variant='outlined'
      label={label}
      sx={{ width:'100%'}}
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={(event)=>setOneFilter(source,event.target.value + ':00.000Z')}
    />
  )
}

