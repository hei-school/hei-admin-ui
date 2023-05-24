import { teachingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const participantProvider: HaDataProviderType = {
  async getList(filter: any) {
    return [
      {
        id: 'string',
        ref: 'STD000001',
        first_name: 'string',
        last_name: 'string',
        email: 'string',
        course_id: 'string',
        exam_id: 'string',
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
  },
  async getOne(raId: string) {
    return {
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
  },
  async saveOrUpdate(resources: Array<any>) {
    console.log(resources)
    const grades = resources[0]
    const { course_id, exam_id, ...payload } = grades
    const result = await teachingApi().crupdateStudentsGrade(course_id, exam_id, payload)
    console.log(result.data)
    return { ...result.data }
  }
}

export default participantProvider
