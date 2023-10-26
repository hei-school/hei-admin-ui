import { TextField } from '@mui/material'
import { useContext } from 'react'
import { ToolbarContext } from './FilterForm'

export function TextFilter({ label, source }) {
  const { currentFilter, setOneFilter } = useContext(ToolbarContext)
  return (
    <TextField
      type='text'
      label={label}
      size='small'
      variant='outlined'
      value={currentFilter[source] || ''}
      sx={{width:'100%', minWidth:'320px'}}
      onChange={(event)=>setOneFilter(source, event.target.value)}
    />
  )
}
