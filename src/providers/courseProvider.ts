import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const courseProvider: HaDataProviderType = {
  async getList(page: number, pageSize: number, filter: any) {
    const { code, name, credits, teacherFirstName, teacherLastName, creditsOrder, codeOrder, options } = filter
    const result = await teachingApi().getCourses(code, name, credits, teacherFirstName, teacherLastName, creditsOrder, codeOrder, page, pageSize, options)
    return result.data
  },
  async getOne(id: string) {
    const result = (await teachingApi().getCourseById(id)).data
    return result
  },
  async saveOrUpdate(courses: any) {
    const result = await teachingApi().crupdateCourses(courses)
    return { ...result.data }
  }
}

export default courseProvider
