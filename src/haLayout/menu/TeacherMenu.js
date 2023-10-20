import { School } from '@mui/icons-material'
import { SingleMenu } from './utils'

function TeacherMenu(){
  return <SingleMenu to='/students' label='Étudiants' icon={<School />} />
}

export default TeacherMenu 
