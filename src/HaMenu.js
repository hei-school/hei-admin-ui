import { useState, useEffect } from 'react'
import authProvider from './providers/authProvider'
import HaStudentMenu from './HaStudentMenu'
import HaManagerMenu from './HaManagerMenu'
import HaTeacherMenu from './HaTeacherMenu'
import { useAsync } from 'react-async'

const getPermission = async ({ authProvider }) => {
  const res = await authProvider.getUserInformations()
  return res
}

const HaMenu = () => {
  const [role, setRole] = useState()
  const { data, isPending } = useAsync({ promiseFn: getPermission, authProvider: authProvider })
  useEffect(() => {
    if (!isPending && data) {
      setRole(data.role)
    }
  }, [isPending, data])

  if (role === 'STUDENT') {
    return <HaStudentMenu />
  } else if (role === 'MANAGER') {
    return <HaManagerMenu />
  } else if (role === 'TEACHER') {
    return <HaTeacherMenu />
  }
  return <></>
}

export default HaMenu
