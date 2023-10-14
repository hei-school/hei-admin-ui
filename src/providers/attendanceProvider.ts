import { attendanceApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const attendanceProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await attendanceApi().getStudentsAttendance(
      page,
      perPage,
      filter.courses_ids,
      filter.teachers_ids,
      filter.student_key_word,
      filter.from,
      filter.to,
      filter.attendance_statuses
    )

    return result.data;
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(payload: any) {
    throw new Error('Function not implemented.')
  }
}

export default attendanceProvider  
