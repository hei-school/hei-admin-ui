import { usersApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'
import authProvider from './authProvider'

const profileProvider: HaDataProviderType = {
  async getOne(id: string) {
    const role = authProvider.getCachedRole()
    if (role === 'STUDENT') {
      return usersApi()
        .getStudentById(id)
        .then(result => result.data)
    }
    if (role === 'TEACHER') {
      return usersApi()
        .getTeacherById(id)
        .then(result => result.data)
    }
    if (role === 'MANAGER') {
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
