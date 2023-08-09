import { RadioButtonGroupInput } from 'react-admin'
import { Typography } from '@mui/material'

export const SexRadioButton = () => {
  return (
    <>
      <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Sexe</Typography>
      <RadioButtonGroupInput
        source='sex'
        label=''
        choices={[
          { id: 'M', name: 'Homme' },
          { id: 'F', name: 'Femme' }
        ]}
        sx={{
          '& .css-pqqtcc-MuiButtonBase-root-MuiRadio-root.Mui-checked': {
            color: '#F8BF4F'
          },
          '& .css-pqqtcc-MuiButtonBase-root-MuiRadio-root': {
            color: '#FDEAC4'
          }
        }}
      />
    </>
  )
}
