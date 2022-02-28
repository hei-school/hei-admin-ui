import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const teacherProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getTeachers(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return result.data
  },
  async getOne(id: string) {
    const result = await usersApi().getTeacherById(id)
    return result.data
  },
  async saveOrUpdate(users: Array<any>) {
    const result = await usersApi().createOrUpdateTeachers(users)
    return result.data
  }
}

export default teacherProvider
