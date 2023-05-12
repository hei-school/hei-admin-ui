import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const courseProvider: HaDataProviderType = {
  async getList(page: number, pageSize: number, filter: any) {
    const result = await teachingApi().getCourses(
      filter.code,
      filter.name,
      filter.credits,
      filter.teacherFirstName,
      filter.teacherLastName,
      filter.creditsOrder,
      filter.codeOrder,
      page,
      pageSize,
      filter.options
    )
    return result.data
  },
  async getOne(id: string) {
    const result = await teachingApi().getCourseById(id)
    return result.data
  },
  async saveOrUpdate(courses: any) {
    const result = await teachingApi().crupdateCourses(courses)
    return { ...result.data }
  }
}

export default courseProvider
