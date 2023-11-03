import { HaDataProviderType } from './HaDataProviderType'
import { teachingApi } from './api'

const groupStudentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    return await teachingApi()
      .getAllStudentByGroup(meta.groupId, page, perPage, filter)
      .then(result => {
        return result.data
      })
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(payload: any) {
    throw new Error('Function not implemented.')
  }
}

export default groupStudentProvider
