import { Fee, FeeStatusEnum, FeeTypeEnum } from 'src/gen/haClient'

export const feelsMock: Fee[] = [
  {
    id: 'fee1_id',
    student_id: 'student1_id',
    remaining_amount: 200000,
    status: FeeStatusEnum.Late,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 240000,
    creation_datetime: '2021-11-08T08:25:24Z',
    due_datetime: '2021-12-08T08:25:24Z'
  },
  {
    id: 'fee2_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee3_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee4_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee5_id',
    student_id: 'student1_id',
    remaining_amount: 50000,
    status: FeeStatusEnum.Unpaid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee6_id',
    student_id: 'student1_id',
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
    student_id: 'student1_id',
    remaining_amount: 10000,
    status: FeeStatusEnum.Late,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee8_id',
    student_id: 'student1_id',
    remaining_amount: 50000,
    status: FeeStatusEnum.Unpaid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee9_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 20000,
    creation_datetime: '2021-11-08T08:25:24Z',
    due_datetime: '2021-12-08T08:25:24Z'
  },
  {
    id: 'fee10_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Hardware,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2021-11-10T08:25:24Z',
    due_datetime: '2021-12-10T08:25:24Z'
  },
  {
    id: 'fee11_id',
    student_id: 'student1_id',
    remaining_amount: 5000,
    status: FeeStatusEnum.Unpaid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 5000,
    creation_datetime: '2022-12-08T08:25:24Z',
    due_datetime: '2021-12-09T08:25:24Z'
  },
  {
    id: 'fee12_id',
    student_id: 'student1_id',
    remaining_amount: 0,
    status: FeeStatusEnum.Paid,
    type: FeeTypeEnum.Tuition,
    comment: 'Comment',
    total_amount: 20000,
    creation_datetime: '2021-11-08T08:25:24Z',
    due_datetime: '2021-12-08T08:25:24Z'
  }
]
export const fee1Mock: Fee = {
  id: 'fee1_id',
  student_id: 'student1_id',
  remaining_amount: 0,
  status: FeeStatusEnum.Late,
  type: FeeTypeEnum.Tuition,
  comment: 'Comment',
  total_amount: 5000,
  creation_datetime: '2021-11-08T08:25:24Z',
  due_datetime: '2021-12-08T08:25:24Z'
}
