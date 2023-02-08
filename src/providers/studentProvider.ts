import { usersApi, payingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'
import { EnableStatus } from 'src/gen/haClient'

const studentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getStudents(page, perPage, filter.ref, filter.first_name, filter.last_name)
    return result.data
  },
  async getOne(id: string) {
    const result = await usersApi().getStudentById(id)
    return result.data
  },
  async saveOrUpdate(payload: any) {
    const [fees, student] = payload[0]
    Object.assign(student, { status: EnableStatus.Enabled })
    const [studentResponse] = (await usersApi().createOrUpdateStudents([student])).data
    fees.length !== 0 && (await payingApi().createStudentFees(studentResponse?.id!, fees))
    return [studentResponse]
  }
}

export default studentProvider
