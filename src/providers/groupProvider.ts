import { HaDataProviderType } from './HaDataProviderType'
import { teachingApi } from './api'

const groupProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return await teachingApi()
      .getGroups(page, perPage, filter)
      .then(result => result.data)
      .catch(error => {
        throw new Error(error)
      })
  },
  async getOne(id: string) {
    return await teachingApi()
      .getGroupById(id)
      .then(result => result.data)
      .catch(error => {
        throw new Error(error)
      })
  },
  async saveOrUpdate(payload: any) {
    console.log(payload)
    return await teachingApi()
      .createOrUpdateGroups(payload)
      .then(result => result.data)
  }
}

export default groupProvider
