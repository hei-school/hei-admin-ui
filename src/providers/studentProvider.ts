import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const studentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getStudents(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return result.data
  },
  async getOne(id: string) {
    const result = await usersApi().getStudentById(id)
    return result.data
  },
  async saveOrUpdate(users: Array<any>) {
    const result = await usersApi().createOrUpdateStudents(users)
    return result.data
  }
}

export default studentProvider
