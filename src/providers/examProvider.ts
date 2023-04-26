import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const examProvider: HaDataProviderType = {
  async getList(filter: any) {
    const courseId = filter
    const result = await teachingApi().getExamsByCourseId(courseId)
    return result.data
  },
  async getOne(_raId: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(resources: Array<any>) {
    const exams = resources[0]
    const exam = exams[0]
    const result = await teachingApi().crupdateExams(exam.courseId, exam.examInfo)
    return result.data
  }
}

export default examProvider
