import { useContext, useEffect, useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { getObjValue } from '../utils';
import { ToolbarContext } from './FilterForm';

export function AutocompleteFilter({ source, label, fetcher, labelKey, valueKey, labelKeyOnNull }) {
  const { currentFilter, setOneFilter } = useContext(ToolbarContext)
  const [ data, setData ] = useState({options: [], pending: false});

  useEffect(()=> onInputChange({target:{ value: ''}}),[])
  
  const onInputChange = (event) => {
    setData({...data, pending: true})
    fetcher(event.target.value === '' ? undefined : event.target.value)
      .then(response => {
        const newOptions = response.data.map(el => {
          const label = getObjValue(el, labelKey) || getObjValue(el, labelKeyOnNull)
          const value = getObjValue(el, valueKey)
          return { label, value }
        })
        setData({options: newOptions, pending: false})
      })
      .catch(()=> setData({...data, pending: false}))
  }

  return (
    <Autocomplete
      multiple
      loadingText='Chargement...'
      sx={{ width: '100%'}}
      loading={data.pending}
      options={data.options}
      onInputChange={onInputChange}
      value={currentFilter[source] || []}
      onChange={(event, value)=>setOneFilter(source, value)}
      getOptionLabel={ option => option.label}
      isOptionEqualToValue={(option1, option2)=> option1.value === option2.value}
      renderOption={(props, option)=> <li {...props} key={option.value}>{option.label}</li>}
      renderInput={ params => <TextField {...params} label={label} variant='outlined' /> }
    />
  );
}

