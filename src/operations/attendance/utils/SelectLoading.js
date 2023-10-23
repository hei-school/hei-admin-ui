import { TextField, MenuItem, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useListFilterContext } from 'react-admin'
import { Items } from './Items'

export function SelectLoading({ fetcher, source, label, valueKey, labelKey }) {
  const [data, setData] = useState({ options: [], pending: true })
  const { filterValues, setFilters } = useListFilterContext()
  const [values, setValues] = useState(filterValues[source] || [])
  const error = !data.pending && !data.options.length

  useEffect(() => {
    fetcher.then(response => setData({ options: response.data, pending: false })).catch(() => setData({ ...data, pending: false }))
  }, [])

  useEffect(() => {
    filterValues[source] !== values && setValues(filterValues[source] || [])
  }, [filterValues[source]])

  const checked = item => values.some(el => el.value === item.value)
  const toggleValue = item => {
    const newFilter = !checked(item) ? [...values, item] : [...values].filter(el => el.value !== item.value)
    setValues(newFilter)
    setFilters({ ...filterValues, [source]: newFilter })
  }

  return (
    <TextField
      label={label}
      variant='outlined'
      value={values}
      size='small'
      select
      sx={{ width: 200 }}
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
