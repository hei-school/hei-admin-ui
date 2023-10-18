import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useListFilterContext } from 'react-admin'
import Items from './Items'

function SelectLoading({ fetcher, source, label, valueKey, labelKey}){
  const [options, setOptions] = useState({ data: [], pending: true })
  const { filterValues, setFilters } = useListFilterContext();
  const [values, setValues] = useState(filterValues[source] || [])

  useEffect(()=>{
    fetcher
      .then(response => setOptions({data: response.data, pending: false }))
      .catch(()=>setOptions({...options, pending: false}))
  },[])  
  
  useEffect(()=>{
    filterValues[source] !== values && setValues(filterValues[source] || [])
  },[filterValues[source]])

  const checked = (item)=> Boolean(values.find(el => el.value === item.value))
  const toggleValue = (item)=>{
    const newFilter = !checked(item) ? 
      [...values, item] : 
      [...values].filter(el => el.value !== item.value)
    setValues(newFilter)
    setFilters({...filterValues, [source]: newFilter})
  }

  return (
    <TextField
      label={label}
      variant='outlined'
      value={values}
      size='small'
      select
      sx={{ width: 150 }}
      SelectProps={{
        multiple: true,
        renderValue: selected => selected.map(el => el.label).join(', '),
      }}
    >
      <Items 
        valueKey={valueKey} 
        checked={checked} 
        onClick={toggleValue} 
        labelKey={labelKey} 
        options={options}
      />
    </TextField>
  ) 
}

export default SelectLoading
