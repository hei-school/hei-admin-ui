import { payingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

const raSeparator = '--'
const toRaId = (studentId: string, feeId: string): string => studentId + raSeparator + feeId
const toApiIds = (raId: string) => {
  const ids = raId.split(raSeparator)
  return { studentId: ids[0], feeId: ids[1] }
}

const feeProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, filter: any) {
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
  async saveOrUpdate(resources: Array<any>) {
    const fees = resources[0]
    const studentId = fees[0] ? fees[0].student_id : null
    fees.forEach((fee: any) => {
      if (fee.student_id !== studentId) {
        throw new Error('Creation of fees for multiple students not supported')
      }
    })

    const result = await payingApi().createStudentFees(studentId, { data: fees })
    return { ...result.data }
  }
}

export default feeProvider
