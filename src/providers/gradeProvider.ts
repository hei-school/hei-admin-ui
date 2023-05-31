import { teachingApi } from './api'
import authProvider from './authProvider'
import { HaDataProviderType } from './HaDataProviderType'
const gradeProvider: HaDataProviderType = {
  async getList(filter: any) {
    const result = await teachingApi().getStudentGrades(filter.studentId ?? authProvider.getCachedWhoami().id)
    return result.data
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(resources: any) {
    throw new Error('Function not implemented.')
  }
}

export default gradeProvider
