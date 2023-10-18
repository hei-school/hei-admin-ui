import { teachingApi, usersApi } from '../../../providers/api'
import { SelectLoading } from '../utils'
import { Box } from '@mui/material'
import { ExportButton, FilterButton, FilterForm, DateTimeInput, useListFilterContext, CreateButton } from 'react-admin'

export const attendanceFilters = [
  <DateTimeInput variant='outlined' source='from' label='Après' />,
  <DateTimeInput variant='outlined' source='to' label='Avant' />,
]

function ListActions(){
  const { displayedFilters }= useListFilterContext()

  return (
    <Box sx={{display:'flex', alignItems:'center',justifyContent:'space-between',width:'100% !important',p: 0,gap: 2}}>
      <Box sx={{display:'flex',width:'auto',justifyContent:'start',alignItems:'center',gap: 2}}>
        <SelectLoading 
          fetcher={ teachingApi().getCourses() } 
          source='courses_ids'  
          label='Cours' 
          labelKey='code' 
          valueKey='id' 
        />
        <SelectLoading 
          fetcher={ usersApi().getTeachers() } 
          source='teachers_ids'  
          label='Profs' 
          labelKey='first_name' 
          valueKey='id' 
        />
        {(displayedFilters.to || displayedFilters.from) && <FilterForm filters={attendanceFilters}/>}
        
      </Box>
      <Box sx={{display:'flex', alignItems:'center',gap: 2}}>
        { !(displayedFilters.to && displayedFilters.from) && 
          <FilterButton filters={attendanceFilters}/>
        }
        <ExportButton />
        <CreateButton />
      </Box>
    </Box>
  )
}

export default ListActions
