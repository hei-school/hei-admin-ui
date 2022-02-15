import React, { useState, useEffect } from 'react'
import authProvider from './providers/authProvider'
import HaStudentMenu from './HaStudentMenu'
import HaManagerMenu from './HaManagerMenu'
import HaTeacherMenu from './HaTeacherMenu'
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
    return <HaStudentMenu />
  }
  if (role === 'MANAGER') {
    return <HaManagerMenu />
  }
  if (role === 'TEACHER') {
    return <HaTeacherMenu />
  }
  return <></>
}

export default HaMenu
