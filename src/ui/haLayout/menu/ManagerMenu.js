import { ListMenu, ListMenuItem, SingleMenu } from './utils'
import { WorkOutlined, SchoolOutlined, PeopleOutlined, WarningOutlined, Groups, HowToRegOutlined } from '@mui/icons-material'

function ManagerMenu() {
  return (
    <>
      <SingleMenu to='/teachers' label='Enseignants' icon={<WorkOutlined />} />
      <SingleMenu to='/groups' label='Groupes' icon={<Groups />} data-testid='groups' />
      <SingleMenu to='/scanners' label='Scanners' icon={<HowToRegOutlined/>} />
      <ListMenu label='Étudiants' icon={<SchoolOutlined />} data-testid='students-menu'>
        <ListMenuItem label='Liste des étudiants' icon={<PeopleOutlined />} to='/students' />
        <ListMenuItem label='Frais en retards' icon={<WarningOutlined />} to='/fees' />
      </ListMenu>
    </>
  )
}

export default ManagerMenu
