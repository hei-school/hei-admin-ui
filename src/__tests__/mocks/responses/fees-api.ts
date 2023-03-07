import { Fee, FeeStatusEnum, FeeTypeEnum, Payment } from 'src/gen/haClient'
import { student1Mock } from './student-api'

export const fee1Mock: Fee = {
  id: 'fee1_id',
  student_id: student1Mock.id,
  remaining_amount: 200000,
  status: FeeStatusEnum.Late,
  type: FeeTypeEnum.Tuition,
  comment: 'Comment',
  total_amount: 400000,
  creation_datetime: '2021-11-08T08:25:24Z',
  due_datetime: '2021-12-08T08:25:24Z'
}

export const unpaidFeeMock: Fee = {
  id: 'fee2_id',
  student_id: student1Mock.id,
  remaining_amount: 250000,
  status: FeeStatusEnum.Unpaid,
  type: FeeTypeEnum.Tuition,
  comment: 'Un grand montant à payer petit à petit',
  total_amount: 250000,
  creation_datetime: '2022-11-08T08:25:24Z',
  due_datetime: '2022-12-08T08:25:24Z'
}

export const feesMock: Fee[] = [
  fee1Mock,
  unpaidFeeMock,
  {
    id: 'fee3_id',
    student_id: student1Mock.id,
    remaining_amount: 200000,
    status: FeeStatusEnum.Late,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 400000,
    creation_datetime: '2021-11-08T08:25:24Z'
  },
  {
    id: 'fee4_id',
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 400000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee5_id',
    student_id: student1Mock.id,
    remaining_amount: 200000,
    status: FeeStatusEnum.Unpaid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 200000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee6_id',
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 20000,
    creation_datetime: '2021-11-08T08:25:24Z',
    due_datetime: '2021-12-08T08:25:24Z'
  },
  {
    id: 'fee7_id',
    student_id: student1Mock.id,
    remaining_amount: 100000,
    status: FeeStatusEnum.Late,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 250000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee8_id',
    student_id: student1Mock.id,
    remaining_amount: 50000,
    status: FeeStatusEnum.Unpaid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 50000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee9_id',
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 25000,
    creation_datetime: '2021-11-08T08:25:24Z',
    due_datetime: '2021-12-08T08:25:24Z'
  },
  {
    id: 'fee10_id',
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 250000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  }
]

let newLateFeesMock: Fee[] = []

feesMock.forEach(e => {
  let newE: Fee = {
    id: e.id,
    student_id: e.student_id,
    remaining_amount: e.total_amount ? e.total_amount / 2 : 10000,
    status: FeeStatusEnum.Late,
    type: e.type,
    comment: e.comment,
    total_amount: e.total_amount,
    creation_datetime: e.creation_datetime,
    due_datetime: e.due_datetime
  }
  newLateFeesMock.push(newE)
})

export const UpdateFeeWithPaymentMock: (fee: Fee, payment: Payment) => Fee = (fee, payment) => {
  let newFee = fee
  newFee.remaining_amount = newFee.remaining_amount
    ? payment.amount
      ? newFee.remaining_amount - payment.amount
      : newFee.remaining_amount
    : newFee.remaining_amount
  return newFee
}

export const createFeeWithPredefinedDataMock: (feeDate: string) => Fee[] = feeDate => {
  return [
    {
      id: 'new_fee_id',
      student_id: student1Mock.id,
      remaining_amount: fee1Mock.total_amount,
      status: FeeStatusEnum.Unpaid,
      type: FeeTypeEnum.Tuition,
      comment: 'comment',
      total_amount: fee1Mock.total_amount,
      creation_datetime: feeDate + 'T12:25:24Z',
      due_datetime: feeDate + 'T12:25:24Z'
    }
  ]
}
export const createFeeWithManualDataMock: (date: string, amount: number, comment: string, monthsNumber: number) => Fee[] = (
  date,
  amount,
  comment,
  monthsNumber
) => {
  let fees: Fee[] = []
  for (let i = 0; i < monthsNumber; i++) {
    fees.push({
      id: `new_fee_${i + 1}_id{}`,
      student_id: student1Mock.id,
      remaining_amount: amount,
      status: FeeStatusEnum.Unpaid,
      type: FeeTypeEnum.Tuition,
      comment: comment,
      total_amount: amount,
      creation_datetime: date + 'T12:25:24Z',
      due_datetime: date + 'T12:25:24Z'
    })
  }
  return fees
}
export const createdFeesForNewStudent: Fee = {
  id: 'ajbfq-fqdfjdh-2jkg3j',
  student_id: 'STD000001',
  remaining_amount: 1740000,
  status: FeeStatusEnum.Unpaid,
  type: FeeTypeEnum.Tuition,
  comment: 'Écolage annuel 1x (2022)',
  total_amount: 1740000,
  creation_datetime: new Date().toISOString(),
  due_datetime: '2023-01-14T21:00:00Z'
}
export const addFeeMock: (fees: Fee[], fee: Fee[]) => Fee[] = (fees, feesAaded) => [...feesAaded, ...fees].slice(0, 10)

export const lateFeesMock = newLateFeesMock
