import { Groups, School } from '@mui/icons-material'
import { SingleMenu } from './utils'

function TeacherMenu() {
  return (
    <>
      <SingleMenu to='/students' label='Étudiants' icon={<School />} />
      <SingleMenu to='/groups' label='Groupes' icon={<Groups />} data-testid='groups' />
    </>
  )
}

export default TeacherMenu
