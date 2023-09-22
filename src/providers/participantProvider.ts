import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const participantProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await teachingApi().getExamDetail(filter.course_id, filter.exam_id.split('--')[1])
    const participants = result.data.participants
    const participantList: any = []
    participants?.forEach(participant => participantList.push({ ...participant, id: `${filter.exam_id}--${participant.id}` }))
    return participantList
  },
  async getOne(raId: string) {
    const [courseId, examId, participantId] = raId.split('--')
    const result = (await teachingApi().getParticipantById(courseId, examId, participantId)).data
    return result
  },
  async saveOrUpdate(resources: Array<any>) {
    const participant = resources[0]
    const [courseId, examId, participantId] = participant.id.split('--')
    const grade = {
      student_id: participantId,
      score: participant.grade.score
    }
    await teachingApi().crupdateStudentsGrade(courseId, examId, [grade])
    const updatedParticipant = (await teachingApi().getParticipantById(courseId, examId, participantId)).data
    return [updatedParticipant]
  }
}

export default participantProvider
