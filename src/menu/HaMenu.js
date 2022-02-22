import { useState, useEffect } from 'react'
import authProvider from '../providers/authProvider'
import StudentMenu from './StudentMenu'
import ManagerMenu from './ManagerMenu'
import TeacherMenu from './TeacherMenu'
import { useAsync } from 'react-async'

const HaMenu = () => {
  const [role, setRole] = useState()
  const { data, isPending } = useAsync({ promiseFn: authProvider.whoami })
  useEffect(() => {
    if (!isPending && data) {
      setRole(data.role)
    }
  }, [isPending, data])

  if (role === 'STUDENT') {
    return <StudentMenu />
  }
  if (role === 'MANAGER') {
    return <ManagerMenu />
  }
  if (role === 'TEACHER') {
    return <TeacherMenu />
  }
  return <></>
}

export default HaMenu
