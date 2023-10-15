import { teachingApi, usersApi } from '../../../providers/api'
import { SelectLoading } from '../utils'
import { Box } from '@mui/material'


function ListActions(){
  return (
    <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
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
    </Box>
  )
}

export default ListActions
