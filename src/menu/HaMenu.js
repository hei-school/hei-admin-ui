import authProvider from '../providers/authProvider'
import StudentMenu from './StudentMenu'
import ManagerMenu from './ManagerMenu'
import TeacherMenu from './TeacherMenu'
import { WhoamiRoleEnum } from '../gen/haClient'

const HaMenu = () => {
  const role = authProvider.getCachedWhoami().role
  switch (role) {
    case WhoamiRoleEnum.Student:
      return <StudentMenu />

    case WhoamiRoleEnum.Manager:
      return <ManagerMenu />

    case WhoamiRoleEnum.Teacher:
      return <TeacherMenu />
    default:
      return null
  }
}

export default HaMenu
