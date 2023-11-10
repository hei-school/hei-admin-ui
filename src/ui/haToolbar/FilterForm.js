import { Button } from '@mui/material'
import { FilterList } from '@mui/icons-material'
import { createContext, useState } from 'react'
import { useListFilterContext } from 'react-admin'
import { FilterContentResponsive } from './FilterFormContent'
import { HaActionWrapper } from '../haList'

export const ToolbarContext = createContext()

export function FilterForm({ children }) {
  const { filterValues, setFilters } = useListFilterContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentFilter, setCurrentFilter] = useState(filterValues)

  const submitChange = () => setFilters(currentFilter)
  const setOneFilter = (source, values) => setCurrentFilter(prev => ({ ...prev, [source]: values }))

  const handleCloseFilter = isChangedMade => {
    setAnchorEl(null)
    if (!isChangedMade) {
      setCurrentFilter(filterValues)
    }
  }

  return (
    <ToolbarContext.Provider value={{ setCurrentFilter, currentFilter, setOneFilter}}>
      <HaActionWrapper button={
        <Button variant='text' size='small' data-testid='add-filter' onClick={e => setAnchorEl(e.currentTarget)}>
          <FilterList sx={{ mr: 0.5 }} /> Filtres
        </Button>
      } />
      <FilterContentResponsive anchorEl={anchorEl} onClose={handleCloseFilter} onSubmit={submitChange}>
        {children}
      </FilterContentResponsive>
    </ToolbarContext.Provider>
  )
}
