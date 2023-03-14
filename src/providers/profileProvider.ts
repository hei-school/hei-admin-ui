import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'
import authProvider from './authProvider'
import { WhoamiRoleEnum } from '../gen/haClient'

const profileProvider: HaDataProviderType = {
  async getOne(id: string) {
    const role = authProvider.getCachedRole()
    if (role === WhoamiRoleEnum.Student) {
      return usersApi()
        .getStudentById(id)
        .then(result => result.data)
    }
    if (role === WhoamiRoleEnum.Teacher) {
      return usersApi()
        .getTeacherById(id)
        .then(result => result.data)
    }
    if (role === WhoamiRoleEnum.Manager) {
      return usersApi()
        .getManagerById(id)
        .then(result => result.data)
    }
  },
  getList: function (page: number, perPage: number, filter: any): Promise<any[]> {
    throw new Error('Function not implemented.')
  },
  saveOrUpdate: function (resources: any[]): Promise<any[]> {
    throw new Error('Function not implemented.')
  }
}

export default profileProvider
