import { FilterListItemClasses, useListFilterContext } from 'react-admin'
import { IconButton, ListItemButton, ListItemText, ListItemSecondaryAction } from '@mui/material'
import { Cancel } from '@mui/icons-material'
import { useEffect, useState } from 'react'

export function FilterListItem({ label, value, type }) {
  const { filterValues, setFilters } = useListFilterContext()
  const [values, setValues] = useState(filterValues[type] || [])
  const isSelected = values.indexOf(value) !== -1

  useEffect(() => {
    filterValues[type] !== values && setValues(filterValues[type] || [])
  }, [filterValues[type]])

  const toggleFilter = () => {
    const newFilter = !isSelected ? [...values, value] : [...values].filter(el => el !== value)

    setValues(newFilter)
    setFilters({ ...filterValues, [type]: newFilter })
  }

  return (
    <ListItemButton onClick={toggleFilter} selected={isSelected} className={FilterListItemClasses.listItemButton}>
      <ListItemText primary={label} className={FilterListItemClasses.listItemText} />
      {isSelected && (
        <ListItemSecondaryAction onClick={toggleFilter}>
          <IconButton size='small'>
            <Cancel />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItemButton>
  )
}

export default FilterListItem
