import { ListMenu, ListMenuItem, SingleMenu } from './utils'
import { WorkOutlined, SchoolOutlined, PeopleOutlined, WarningOutlined } from '@mui/icons-material'

function ManagerMenu() {
  return (
    <>
      <SingleMenu to='/teachers' label='Enseignants' icon={<WorkOutlined />} />
      <ListMenu label='Étudiants' icon={<SchoolOutlined />} data-testid='students-menu'>
        <ListMenuItem label='Liste des étudiants' icon={<PeopleOutlined />} to='/students' />
        <ListMenuItem label='Frais en retards' icon={<WarningOutlined />} to='/fees' />
      </ListMenu>
    </>
  )
}

export default ManagerMenu
