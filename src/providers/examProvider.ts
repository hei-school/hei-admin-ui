import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const raSeparator = '--'
const toRaId = (courseId: string, examId: string): string => courseId + raSeparator + examId

const examProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await teachingApi().getExams(page, perPage)
    return result.data.map((exam: any) => ({
      ...exam,
      id: toRaId(exam?.course_id!, exam?.id!)
    }))
  },
  async getOne(_raId: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(resources: Array<any>) {
    const exams = resources[0]
    const result = await teachingApi().crupdateExams(exams)
    return result.data
  }
}

export default examProvider
