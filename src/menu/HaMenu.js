import authProvider from '../providers/authProvider'
import StudentMenu from './StudentMenu'
import ManagerMenu from './ManagerMenu'
import TeacherMenu from './TeacherMenu'

const HaMenu = () => {
  const role = authProvider.getCachedWhoami().role

  if (role === 'STUDENT') {
    return <StudentMenu />
  }
  if (role === 'MANAGER') {
    return <ManagerMenu />
  }
  if (role === 'TEACHER') {
    return <TeacherMenu />
  }
  return null
}

export default HaMenu
