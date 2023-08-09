import { BooleanInput } from 'react-admin'

export const BoolInput = props => {
  const { source, label, name, defaultValue, onChange } = props
  return (
    <BooleanInput
      source={source}
      label={label}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      sx={{
        '& .css-1kk2om-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked': {
          color: '#F8BF4F'
        },
        '& .css-1kk2om-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
          backgroundColor: '#F8BF4F'
        }
      }}
    />
  )
}
