import { UsersApi, Configuration } from '../gen/haClient'
import authProvider from './authProvider'

const conf = new Configuration()
conf.accessToken = authProvider.getToken()
const usersApi = new UsersApi(conf)

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
