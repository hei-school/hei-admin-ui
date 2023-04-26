import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const raSeparator = '--'
const toRaId = (courseId: string, examId: string): string => courseId + raSeparator + examId

const examProvider: HaDataProviderType = {
  async getList(filter: any) {
    const courseId = filter.course_id
    const result = await teachingApi().getExamsByCourseId(courseId)
    return result.data.map((exam: any) => ({
      ...exam,
      id: toRaId(courseId, exam?.id!)
    }))
  },
  async getOne(_raId: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(resources: Array<any>) {
    const exams = resources[0]
    const result = await teachingApi().crupdateExams(exams.course_id, exams.exam_info)
    return result.data
  }
}

export default examProvider
