import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const teacherProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = (await usersApi().getTeachers(page, perPage, filter.ref, filter.first_name, filter.last_name)).data
    return result
  },
  async getOne(id: string) {
    const result = (await usersApi().getTeacherById(id)).data
    return result
  },
  async saveOrUpdate(users: Array<any>) {
    const result = (await usersApi().createOrUpdateTeachers(users)).data
    return result
  }
}

export default teacherProvider
