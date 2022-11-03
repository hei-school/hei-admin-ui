import { payingApi } from './api'
import { HaDataProviderType } from './HaDataProviderType'

import { toApiIds as toApiFeeIds } from './feeProvider'

const raSeparator = '--'
const toRaId = (studentId: string, feeId: string, paymentId: string): string => studentId + raSeparator + feeId + raSeparator + paymentId

const paymentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const { studentId, feeId } = toApiFeeIds(filter.feeId)
    const result = await payingApi().getStudentPayments(studentId, feeId, page, perPage)
    return result.data.map(payment => ({
      ...payment,
      id: toRaId(filter.studentId, feeId, payment.id as string)
    }))
  },
  async getOne(_raId: string) {
    throw new Error('Function not implemented.')
  },
  async saveOrUpdate(resources: Array<any>) {
    const payments = resources[0]
    const raFeeId = payments[0].feeId
    payments.forEach((payment: any) => {
      if (payment.feeId !== raFeeId) {
        throw new Error('Creation of payments for multiple fees not supported')
      }
    })

    const { studentId, feeId } = toApiFeeIds(raFeeId)
    const result = await payingApi().createStudentPayments(studentId, feeId, payments)
    return { ...result.data }
  }
}

export default paymentProvider
