import { Button, Popover, Typography, Box } from '@mui/material'
import { Add } from '@mui/icons-material'
import { createContext, useContext, useState } from 'react'
import { styled } from '@mui/styles'
import { useListFilterContext } from 'react-admin'

const FilterContainer = styled('div')({
  padding: 15,
  overflowX: 'hidden',
  maxHeight: '500px',
  maxWidth: '350px',
  overflowY: 'scroll'
})

export const ToolbarContext = createContext()

function FilterContent({ anchorEl, onClose, onSubmit, children }) {
  const { setCurrentFilter } = useContext(ToolbarContext)

  return (
    <Popover
      open={Boolean(anchorEl)}
      onClose={() => {}}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <FilterContainer>
        <Typography sx={{ color: '#696b6e', fonSize: '15px', mb: 1, fontWeight: 600 }}>Ajouter des filtres</Typography>
        {children}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, gap: 2 }}>
          <Button variant='outlined' size='small' data-testid='cancel-filter' onClick={() => onClose(false)}>
            Annuler
          </Button>
          <Box>
            <Button variant='outlined' size='small' data-testid='clear-filter' onClick={() => setCurrentFilter({})} sx={{ mr: 1 }}>
              Effacer
            </Button>
            <Button
              variant='outlined'
              size='small'
              data-testid='apply-filter'
              onClick={() => {
                onSubmit()
                onClose(true)
              }}
            >
              Appliquer
            </Button>
          </Box>
        </Box>
      </FilterContainer>
    </Popover>
  )
}

export function FilterForm({ children }) {
  const { filterValues, setFilters } = useListFilterContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentFilter, setCurrentFilter] = useState(filterValues)

  const submitChange = () => setFilters(currentFilter)
  const setOneFilter = (source, values) => setCurrentFilter(prev => ({ ...prev, [source]: values }))

  const handleCloseFilter = isChangedMade => {
    if (!isChangedMade) {
      setCurrentFilter(filterValues)
    }
    setAnchorEl(null)
  }

  return (
    <ToolbarContext.Provider value={{ setCurrentFilter, currentFilter, setOneFilter }}>
      <Button variant='text' size='small' data-testid='add-filter' onClick={e => setAnchorEl(e.currentTarget)}>
        <Add sx={{ mr: 0.5 }} /> Filtres
      </Button>
      <FilterContent anchorEl={anchorEl} onClose={handleCloseFilter} onSubmit={submitChange}>
        {children}
      </FilterContent>
    </ToolbarContext.Provider>
  )
}
