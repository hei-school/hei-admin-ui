import { School } from '@mui/icons-material'
import SingleMenu from './utils/SingleMenu'

function TeacherMenu(){
  return (
    <SingleMenu to='/students' label='Étudiants' icon={<School />} />
  )
}

export default TeacherMenu 
