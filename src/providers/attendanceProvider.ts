import { attendanceApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

type SelectFilter = {
  label: string,
  value: string
}

const attendanceProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const { courses_ids, teachers_ids } = filter

    const result = await attendanceApi().getStudentsAttendance(
      page,
      perPage,
      courses_ids ? courses_ids.map(( el : SelectFilter ) => el.value) : undefined,
      teachers_ids ? teachers_ids.map(( el : SelectFilter ) => el.value) : undefined,
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
    return attendanceApi().createAttendanceMovement(payload)
  }
}

export default attendanceProvider  
