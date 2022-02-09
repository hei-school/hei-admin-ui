import { UsersApi, Configuration } from '../gen/haClient'
import authProvider from './authProvider'
import profileProvider from './profileProvider'
import studentProvider from './studentProvider'
import teacherProvider from './teacherProvider'

const conf = new Configuration()

const getProvider = resource => {
  if (resource === 'profile') return profileProvider
  if (resource === 'students') return studentProvider
  if (resource === 'teachers') return teacherProvider
}

const dataProvider = {
  getList(resource, params) {
    const pagination = params.pagination
    const page = pagination.page === 0 ? 1 /* TODO(empty-pages) */ : pagination.page
    const perPage = pagination.perPage > 500 ? 500 : pagination.perPage //TODO: may be appropriate eslswhere? if here, put at least a warning
    const filter = params.filter
    return getProvider(resource).getList(page, perPage, filter)
  },
  getOne(resource, params) {
    conf.accessToken = authProvider.getToken()
    const usersApi = new UsersApi(conf)
    const id = params.id
    let role = sessionStorage.getItem('role')
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
