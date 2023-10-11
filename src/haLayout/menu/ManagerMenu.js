import { ListMenu, ListMenuItem, SingleMenu } from ".";
import {
  WorkOutlined, 
  SchoolOutlined,
  PeopleOutlined,
  WarningOutlined
} from '@mui/icons-material'

function ManagerMenu(){
  return (
    <>
      <SingleMenu to='/teachers' label='Enseignants' icon={<WorkOutlined />} />
      <ListMenu label='Étudiants' icon={<SchoolOutlined />}>
        <ListMenuItem label='Liste des étudiants' icon={<PeopleOutlined sx={{fontSize: '20px'}} />} to='/students'/>
        <ListMenuItem label='Frais en retards' icon={<WarningOutlined sx={{fontSize: '20px'}} />} to='/fees'/>
      </ListMenu>
    </>
  )
}

export default ManagerMenu
