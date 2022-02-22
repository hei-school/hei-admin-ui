import { usersApi } from './api'

const teacherProvider = {
  async getList(page, perPage, filter) {
    const result = await usersApi().getTeachers(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return { data: result.data, total: Number.MAX_VALUE }
  },
  async getOne(id) {
    const result = await usersApi().getTeacherById(id)
    return { data: result.data }
  },
  async saveOrUpdate(users) {
    return usersApi()
      .createOrUpdateTeachers(users)
      .then(result => {
        return { data: result.data[0] }
      })
  }
}

export default teacherProvider
