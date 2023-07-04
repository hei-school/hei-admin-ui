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
    const result = await teachingApi().getExamDetail(courseId, examId)
    return {
      id: 'string--string',
      coefficient: 0,
      title: 'string',
      examination_date: '2023-05-05T06:46:26.852Z',
      participants: [
        {
          id: 'string',
          ref: 'STD000001',
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          grade: {
            score: 12.5,
            created_at: '2023-05-05T06:46:26.853Z'
          }
        },
        {
          id: 'string1',
          ref: 'STD000002',
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          grade: {
            score: 12.5,
            created_at: '2023-05-05T06:46:26.853Z'
          }
        }
      ]
    }
  },
  async saveOrUpdate(resources: Array<any>) {
    const exams = resources[0]
    const exam = exams[0]
    const result = await teachingApi().crupdateExams(exam.courseId, exam.examInfo)
    return result.data
  }
}

export default examProvider
