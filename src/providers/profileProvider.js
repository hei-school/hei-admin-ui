import { usersApi } from './api'

const profileProvider = {
  getOne(id) {
    const role = localStorage.getItem('role')
    if (role === 'STUDENT') {
      return usersApi.getStudentById(id).then(result => {
        return { data: result.data }
      })
    }
    if (role === 'TEACHER') {
      return usersApi.getTeacherById(id).then(result => {
        return { data: result.data }
      })
    }
    if (role === 'MANAGER') {
      return usersApi.getManagerById(id).then(result => {
        return { data: result.data }
      })
    }
  }
}

export default profileProvider
