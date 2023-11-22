import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const scannerProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getScannerUsers(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return result.data
  },
  async getOne(id: string) {
    const result = await usersApi().getScannerUserById(id)
    return result.data
  },
  async saveOrUpdate(users: Array<any>) {
    const result = await usersApi().createOrUpdateScannerUsers(users)
    return result.data
  }
}

export default scannerProvider 
