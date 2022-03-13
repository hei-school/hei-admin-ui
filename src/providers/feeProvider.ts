import { payingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const raSeparator = '--'
const toRaId = (studentId: string, feeId: string): string => studentId + raSeparator + feeId
const toApiIds = (raId: string) => {
  const ids = raId.split(raSeparator)
  return { studentId: ids[0], feeId: ids[1] }
}

const feeProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await payingApi().getStudentFees(filter.studentId)
    return result.data.map(fee => ({
      ...fee,
      id: toRaId(filter.studentId, fee.id as string)
    }))
  },
  async getOne(raId: string) {
    const { studentId, feeId } = toApiIds(raId)
    const result = await payingApi().getStudentFeeById(studentId, feeId)
    return { ...result.data, id: raId }
  },
  async saveOrUpdate(users: Array<any>) {
    throw new Error('Function not implemented.')
  }
}

export default feeProvider
