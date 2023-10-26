import { attendanceApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

type SelectFilter = {
  label: string
  value: string
}

const attendanceProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const { courses_ids = [], teachers_ids = [], attendance_statuses = [] } = filter

    const result = await attendanceApi().getStudentsAttendance(
      page,
      perPage,
      courses_ids.map((el: SelectFilter) => el.value),
      teachers_ids.map((el: SelectFilter) => el.value),
      filter.student_key_word,
      filter.from,
      filter.to,
      attendance_statuses.map((el: SelectFilter) => el.value)
    )

    return result.data
  },
  async getOne(id: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(payload: any) {
    throw new Error('Function not implemented.')
  }
}

export default attendanceProvider
