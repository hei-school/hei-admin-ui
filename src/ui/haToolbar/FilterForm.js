import { FilterList } from '@mui/icons-material'
import { createContext, useContext, useState } from 'react'
import { useListFilterContext } from 'react-admin'
import { FilterContentResponsive } from './FilterFormContent'
import { ButtonBase } from '../haToolbar'
import { HaListContext } from '../haList/HaListTitle'

export const HaToolbarContext = createContext()

export function FilterForm({ children }) {
  const { filterValues, setFilters } = useListFilterContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const listContext = useContext(HaListContext)
  const [currentFilter, setCurrentFilter] = useState(filterValues)

  const submitChange = () => setFilters(currentFilter)
  const setOneFilter = (source, values) => setCurrentFilter(prev => ({ ...prev, [source]: values }))
  const isFilterApplied = Object.keys(filterValues || []).length > 0

  const handleCloseFilter = isChangedMade => {
    setAnchorEl(null)
    listContext.closeAction()
    if (!isChangedMade) {
      setCurrentFilter(filterValues)
    }
  }

  const indicator = {
    position: 'relative',
    '::after': {
      content: '""',
      display: 'block',
      width: '7px',
      position: 'absolute',
      height: '7px',
      bgcolor: 'blue',
      top: '5px',
      borderRadius: '50%',
      right: '5px'
    }
  }

  return (
    <HaToolbarContext.Provider value={{ setCurrentFilter, currentFilter, setOneFilter }}>
      <ButtonBase
        label='Filtres'
        icon={<FilterList />}
        data-testid='add-filter'
        closeAction={false}
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={isFilterApplied ? indicator : undefined}
      />
      <FilterContentResponsive anchorEl={anchorEl} onClose={handleCloseFilter} onSubmit={submitChange}>
        {children}
      </FilterContentResponsive>
    </HaToolbarContext.Provider>
  )
}
