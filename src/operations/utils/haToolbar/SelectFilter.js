import { TextField, MenuItem, CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ToolbarContext } from './AddFilter'
import { Items } from './Items'

export function SelectFilter({ fetcher, source, label, valueKey, labelKey }) {
  const [data, setData] = useState({ options: [], pending: true })
  const { currentFilter, setOneFilter } = useContext(ToolbarContext)
  const values = currentFilter[source] || []
  const error = !data.pending && !data.options.length

  useEffect(() => {
    if(!Array.isArray(fetcher))
      fetcher.then(response => setData({ options: response.data, pending: false })).catch(() => setData({ ...data, pending: false }))
    else 
      setData({ options: fetcher, pending:false})
  }, [])

  const checked = item => values.some(el => el.value === item.value)
  const toggleValue = item => {
    const newFilter = !checked(item) ? [...values, item] : [...values].filter(el => el.value !== item.value)
    setOneFilter(source, newFilter)
  }

  return (
    <TextField
      label={label}
      variant='outlined'
      value={values}
      size='small'
      select
      sx={{ width: '100%',minWidth:'350px',boxSizing:'border-box'}}
      SelectProps={{
        multiple: true,
        renderValue: selected => selected.map(el => el.label).join(', ')
      }}
    >
      {data.pending && (
        <MenuItem value='' sx={{ backgroundColor: 'white !important' }}>
          <CircularProgress style={{ width: '20px', height: '20px' }} />
        </MenuItem>
      )}
      {error && (
        <MenuItem value='' sx={{ fontSize: '.8em', width: '100%', backgroundColor: 'white !important' }}>
          Une erreur c'est produite
        </MenuItem>
      )}
      <Items valueKey={valueKey} checked={checked} onClick={toggleValue} labelKey={labelKey} options={data.options} />
    </TextField>
  )
}
