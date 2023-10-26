import { TextField, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'

export const CustomAutoComplete = ({ data, control, name, label, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          {...props}
          options={data}
          getOptionLabel={option => option.ref}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => onChange(newValue)}
          value={value}
          renderInput={params => <TextField {...params} label={label} />}
        />
      )}
    />
  )
}
