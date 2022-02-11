import { UsersApi, Configuration } from '../gen/haClient'
import authProvider from './authProvider'

const conf = new Configuration()
conf.accessToken = authProvider.getToken()
const usersApi = new UsersApi(conf)

const studentProvider = {
  async getList(page, perPage, filter) {
    const result = await usersApi.getStudents(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return { data: result.data, total: Number.MAX_VALUE }
  },
  async getOne(id) {
    const result = await usersApi.getStudentById(id)
    return { data: result.data }
  }
}

export default studentProvider
