import { MenuItem, IconButton } from '@mui/material'
import { Cancel } from '@mui/icons-material'
import { getObjValue } from '../../utils'

export function Items({ options, labelKey, valueKey, onClick, checked }) {
  return options.map((el, index) => {
    const currentItem = { label: getObjValue(el, labelKey), value: getObjValue(el, valueKey) }
    return (
      <MenuItem
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.7 }}
        onClick={() => onClick(currentItem)}
        key={index}
        value={currentItem.value}
      >
        {currentItem.label}
        {checked(currentItem) && (
          <IconButton sx={{ p: 0 }} size='small'>
            <Cancel />
          </IconButton>
        )}
      </MenuItem>
    )
  })
}
