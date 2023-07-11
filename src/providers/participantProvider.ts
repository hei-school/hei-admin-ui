import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const participantProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await teachingApi().getExamDetail(filter.course_id, filter.exam_id.split('--')[1])
    const participants = [
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
    const participantList: any = []
    participants?.forEach(participant => participantList.push({ ...participant, id: `${filter.exam_id}--${participant.id}` }))
    return participantList
  },
  async getOne(raId: string) {
    const [courseId, examId, participantId] = raId.split('--')
    const result = teachingApi().getParticipantById(courseId, examId, participantId)
    return (await result).data
  },
  async saveOrUpdate(resources: Array<any>) {
    const participant = resources[0]
    const [courseId, examId, participantId] = participant.id
    const grade = {
      student_id: participantId,
      score: participant.grade.score
    }
    await teachingApi().crupdateStudentsGrade(courseId, examId, [grade])
    const updatedParticipant = (await teachingApi().getParticipantById(courseId, examId, participantId)).data
    return { id: 'string', ref: 'STD000001', first_name: 'string', last_name: 'string', email: 'string', grade: grade }
  }
}

export default participantProvider
