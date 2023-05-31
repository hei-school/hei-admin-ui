import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const participantProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await teachingApi().getExamDetail(filter.course_id, filter.exam_id.split('--')[1])
    const participants = result.data.participants
    const participantList: any = []
    participants?.forEach(participant => participantList.push({ ...participant, id: `${filter.course_id}--${filter.exam_id}--${participant.id}` }))
    return participantList
  },
  async getOne(raId: string) {
    const [courseId, examId, participantId] = raId.split('--')
    return teachingApi().getParticipantById(courseId, examId, participantId)
  },
  async saveOrUpdate(resources: Array<any>) {
    const grades = resources[0]
    const { course_id, exam_id, ...payload } = grades
    const result = await teachingApi().crupdateStudentsGrade(course_id, exam_id, payload)
    console.log(result.data)
    return { ...result.data }
  }
}

export default participantProvider
