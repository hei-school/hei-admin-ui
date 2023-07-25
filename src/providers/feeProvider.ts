import { payingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'
import { toApiIds, toRaId } from './utils'

export const studentIdFromRaId = (raId: string): string => toApiIds(raId, 'studentId', 'feeId').studentId

const feeProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = filter.studentId
      ? await payingApi().getStudentFees(filter.studentId, page, perPage)
      : await payingApi().getFees(filter.status, page, perPage)
    return result.data.map(fee => ({
      ...fee,
      id: toRaId(fee.student_id as string, fee.id as string)
    }))
  },
  async getOne(raId: string) {
    const { studentId, feeId } = toApiIds(raId, 'studentId', 'feeId')
    const result = (await payingApi().getStudentFeeById(studentId, feeId)).data
    return { ...result, id: raId }
  },
  async saveOrUpdate(resources: Array<any>) {
    const fees = resources[0]
    const studentId = fees[0] ? fees[0].student_id : null
    fees.forEach((fee: any) => {
      if (fee.student_id !== studentId) {
        throw new Error('Creation of fees for multiple students not supported')
      }
    })

    const result = (await payingApi().createStudentFees(studentId, fees)).data
    return { ...result }
  }
}

export default feeProvider
