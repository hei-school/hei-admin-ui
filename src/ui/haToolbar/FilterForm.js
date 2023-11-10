import { Button } from '@mui/material'
import { FilterList } from '@mui/icons-material'
import { createContext, useState } from 'react'
import { useListFilterContext } from 'react-admin'
import { FilterContentResponsive } from './FilterFormContent'
import { HaActionWrapper } from '../haToolbar'

export const ToolbarContext = createContext()

export function FilterForm({ children }) {
  const { filterValues, setFilters } = useListFilterContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentFilter, setCurrentFilter] = useState(filterValues)
  
  const submitChange = () => setFilters(currentFilter)
  const setOneFilter = (source, values) => setCurrentFilter(prev => ({ ...prev, [source]: values }))
  const isFilterApplied = Object.keys(filterValues || []).length > 0
  
  const handleCloseFilter = isChangedMade => {
    setAnchorEl(null)
    if (!isChangedMade) {
      setCurrentFilter(filterValues)
    }
  }
  
  const indicator = {
    position: 'relative',
    display: 'block',
    '::after': {
      content: '""',
      display: 'block',
      width:'7px',
      position: 'absolute',
      height:'7px',
      bgcolor: 'blue',
      top: '5px',
      borderRadius:'50%',
      right: '5px',
    }
  }

  return (
    <ToolbarContext.Provider value={{ setCurrentFilter, currentFilter, setOneFilter}}>
      <HaActionWrapper>
        <Button sx={ isFilterApplied ? indicator : undefined } variant='text' size='small' data-testid='add-filter' onClick={e => setAnchorEl(e.currentTarget)}>
          <FilterList sx={{ mr: 0.5 }} /> Filtres
        </Button>
      </HaActionWrapper>
      <FilterContentResponsive anchorEl={anchorEl} onClose={handleCloseFilter} onSubmit={submitChange}>
        {children}
      </FilterContentResponsive>
    </ToolbarContext.Provider>
  )
}
