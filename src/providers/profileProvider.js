import { usersApi } from './api'
import authProvider from './authProvider'

const profileProvider = {
  async getOne(id) {
    const role = authProvider.getCachedRole()
    if (role === 'STUDENT') {
      return usersApi()
        .getStudentById(id)
        .then(result => {
          return { data: result.data }
        })
    }
    if (role === 'TEACHER') {
      return usersApi()
        .getTeacherById(id)
        .then(result => {
          return { data: result.data }
        })
    }
    if (role === 'MANAGER') {
      return usersApi()
        .getManagerById(id)
        .then(result => {
          return { data: result.data }
        })
    }
  }
}

export default profileProvider
