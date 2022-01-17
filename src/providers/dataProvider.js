import { UsersApi, Configuration } from '../haClient'
import authProvider from './authProvider'
const conf = new Configuration()

const dataProvider = {
  getList(resource, params) {
    conf.accessToken = authProvider.getToken()
    const usersApi = new UsersApi(conf)
    if (resource === 'teachers') {
      return usersApi.getTeachers().then(result => {
        return { data: result.data, total: result.data.length }
      })
    }
    if (resource === 'students') {
      return usersApi.getStudents().then(result => {
        return { data: result.data, total: result.data.length }
      })
    }
  },
  getOne(resource, params) {
    conf.accessToken = authProvider.getToken()
    const usersApi = new UsersApi(conf)
    const id = params.id
    let role = localStorage.getItem('role')
    if (resource === 'profile') {
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
    if (resource === 'students') {
      return usersApi.getStudentById(id).then(result => {
        return { data: result.data }
      })
    }
    if (resource === 'teachers') {
      return usersApi.getTeacherById(id).then(result => {
        return { data: result.data }
      })
    }
  },
  getMany(resource, params) {},
  getManyReference(resource, params) {},
  update(resource, params) {
    conf.accessToken = authProvider.getToken()
    const usersApi = new UsersApi(conf)
    if (resource === 'students') {
      return usersApi.createOrUpdateStudents([params.data]).then(result => {
        return { data: result.data[0] }
      })
    }
    if (resource === 'teachers') {
      return usersApi.createOrUpdateTeachers([params.data]).then(result => {
        return { data: result.data[0] }
      })
    }
  },
  updateMany(resource, params) {},
  create(resource, params) {
    conf.accessToken = authProvider.getToken()
    const usersApi = new UsersApi(conf)
    const user = params.data

    user.id = ''
    user.status = 'ENABLED'

    if (resource === 'students') {
      return usersApi.createOrUpdateStudents([user]).then(result => {
        return { data: result.data[0] }
      })
    }
    if (resource === 'teachers') {
      return usersApi.createOrUpdateTeachers([user]).then(result => {
        return { data: result.data[0] }
      })
    }
  },
  delete(resource, params) {},
  deleteMany(resource, params) {}
}

export default dataProvider
