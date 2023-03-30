import authProvider from '../providers/authProvider'
import StudentMenu from './StudentMenu'
import ManagerMenu from './ManagerMenu'
import TeacherMenu from './TeacherMenu'
import { WhoamiRoleEnum } from '../gen/haClient'

const HaMenu = () => {
  const role = authProvider.getCachedWhoami().role

  if (role === WhoamiRoleEnum.Student) {
    return <StudentMenu />
  }
  if (role === WhoamiRoleEnum.Manager) {
    return <ManagerMenu />
  }
  if (role === WhoamiRoleEnum.Teacher) {
    return <TeacherMenu />
  }
  return null
}

export default HaMenu
