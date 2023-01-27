import { PaymentTypeEnum, Payment } from 'src/gen/haClient'
import { fee1Mock } from './fees-api'

export const payment1Mock: Payment = {
  id: 'payment3_id',
  fee_id: fee1Mock.id,
  creation_datetime: '2022-11-11T08:25:26Z',
  type: PaymentTypeEnum.Cash,
  amount: 5000,
  comment: 'Comment'
}

export const creatPaymentMockWithAmaunt: (amount: number) => Payment = amount => {
  return { id: 'payment3_id', fee_id: fee1Mock.id, creation_datetime: '2022-11-11T08:25:26Z', type: PaymentTypeEnum.Cash, amount: amount, comment: 'Comment' }
}
