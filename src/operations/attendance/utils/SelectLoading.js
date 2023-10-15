import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import Items from './Items'

function SelectLoading({ fetcher, source, label, valueKey, labelKey}){
  const [options, setOptions] = useState({ data: [], pending: true })
  const [values, setValues] = useState([])

  useEffect(()=>{
    fetcher
      .then(response => setOptions({data: response.data, pending: false }))
      .catch(()=>setOptions({...options, pending: false}))
  },[])  

  const checked = (choice)=>values.find(el => el.value === choice.value)
  
  const toggleValue = (choice)=>{
    const newValues = !checked(choice) ? 
      [...values, choice] : 
      [...values].filter(el => el.value !== choice.value)
    
    setValues(newValues)
  }

  return (
    <TextField
      label={label}
      variant='outlined'
      value={values}
      size='small'
      select
      sx={{ width: 200, '& input':{color:'red'}}}
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
