import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const raSeparator = '--'
const toRaId = (courseId: string, examId: string): string => courseId + raSeparator + examId
export const toApiIds = (raId: string) => {
  const ids = raId.split(raSeparator)
  return { courseId: ids[0], examId: ids[1] }
}
const examProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await teachingApi().getExamsByCourseId(filter.course_id)
    return result.data.map(exam => ({
      ...exam,
      id: toRaId(filter.course_id, exam.id as string)
    }))
  },
  async getOne(raId: string) {
    const { courseId, examId } = toApiIds(raId)
    const examDetail = (await teachingApi().getExamDetail(courseId, examId)).data
    examDetail.id = `${courseId}--${examDetail.id}`
    return examDetail
  },
  async saveOrUpdate(resources: Array<any>) {
    const exams = resources[0]
    const exam = exams[0]
    const result = (await teachingApi().crupdateExams(exam.courseId, exam.examInfo)).data
    return result
  }
}

export default examProvider
