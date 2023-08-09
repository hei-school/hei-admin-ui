import { SaveButton } from 'react-admin'

export const Save = () => (
  <SaveButton
    sx={{
      float: 'right',
      mb: '20px',
      height: '40px',
      bgcolor: '#FDEAC4',
      borderRadius: '10px',
      boxShadow: 'none',
      color: '#F8BF4F',
      '&:hover': {
        bgcolor: '#FDEAC4',
        boxShadow: 'none'
      }
    }}
  />
)
