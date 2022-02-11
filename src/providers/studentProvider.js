import { usersApi } from './api'

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
