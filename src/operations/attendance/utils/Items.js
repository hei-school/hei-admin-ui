import { MenuItem, CircularProgress, Checkbox } from '@mui/material'
import { getObjValue } from './utils'

export function Items({ options, labelKey, valueKey, onClick, checked }) {
  if (options.data.length) {
    return options.data.map((el, index) => {
      const currentItem = { label: getObjValue(el, labelKey), value: getObjValue(el, valueKey) }
      return (
        <MenuItem sx={{ py: 0, px: 1 }} onClick={() => onClick(currentItem)} key={index} value={currentItem.value}>
          <Checkbox checked={checked(currentItem)} size='small' />
          {currentItem.label}
        </MenuItem>
      )
    })
  }

  return options.pending ? (
    <MenuItem value='' sx={{ backgroundColor: 'white !important' }}>
      <CircularProgress style={{ width: '20px', height: '20px' }} />
    </MenuItem>
  ) : (
    <MenuItem value='' sx={{ fontSize: '.8em', width: '100%', backgroundColor: 'white !important' }}>
      Une erreur c'est produite
    </MenuItem>
  )
}
