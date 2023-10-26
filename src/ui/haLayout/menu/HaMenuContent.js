import { WhoamiRoleEnum } from '../../../gen/haClient'
import authProvider from '../../../providers/authProvider'
import ManagerMenu from './ManagerMenu'
import StudentMenu from './StudentMenu'
import TeacherMenu from './TeacherMenu'

export function HaMenuContent() {
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
