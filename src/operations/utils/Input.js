import { TextInput } from 'react-admin'
import { Box, Typography } from '@mui/material'

export const Input = props => {
  const { source, placeholder, type, name, disabled, validate } = props

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>{placeholder}</Typography>
      <TextInput
        source={source}
        placeholder={placeholder}
        variant='outlined'
        label=''
        type={type}
        name={name}
        disabled={disabled}
        validate={validate}
        sx={{
          width: '300px',
          height: '50px',
          '& .css-146qo9o-MuiInputBase-root-MuiOutlinedInput-root': {
            height: '40px'
          },
          '& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input': {
            fontSize: '15px'
          }
        }}
      />
    </Box>
  )
}
