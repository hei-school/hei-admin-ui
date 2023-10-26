import React, { useMemo } from 'react';
import { Input, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material'
import { useListFilterContext } from 'ra-core';
import { actionUI } from '../constants'

export function LiveFilter({ source, placeholder }) {
  const { filterValues, setFilters } = useListFilterContext();
  const initialValues = useMemo(() => filterValues[source] || '',[filterValues[source]]);
  const handleChange = event => setFilters({ ...filterValues, [source]: event.target.value }, null)
  
  const style = {
    ':hover':{bgcolor:'white', color:'black'},
    width:'220px',
    fontSize: '16px'
  }

  return (
    <Input
      size='small'
      placeholder={placeholder}
      defaultValue={initialValues}
      sx={{...actionUI, ...style}}
      onChange={handleChange}
      endAdornment={
        <InputAdornment position='end'> 
          <Search /> 
        </InputAdornment> 
      }
    />
  );
};
