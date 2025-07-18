import {
  Fee,
  FeeStatusEnum,
  FeeTypeEnum,
  LetterStatus,
  Payment,
} from "@haapi/typescript-client";
import {student1Mock} from "./students-mocks";

export const fee1Mock: Fee = {
  id: "fee1_id",
  student_id: student1Mock.id,
  remaining_amount: 200000,
  status: FeeStatusEnum.LATE,
  type: FeeTypeEnum.TUITION,
  comment: "Comment",
  frequency: "YEARLY",
  mpbs: [],
  category: "L3",
  total_amount: 400000,
  creation_datetime: new Date("2021-11-08"),
  due_datetime: new Date("2021-12-08"),
};

export const unpaidFeeMock: Fee = {
  id: "fee2_id",
  student_id: student1Mock.id,
  remaining_amount: 250000,
  status: FeeStatusEnum.UNPAID,
  type: FeeTypeEnum.TUITION,
  mpbs: [],
  comment: "Un grand montant à payer petit à petit",
  total_amount: 250000,
  creation_datetime: new Date("2022-11-08"),
  due_datetime: new Date("2022-12-08"),
  category: "L3",
};

export const feesMock: Fee[] = [
  fee1Mock,
  unpaidFeeMock,
  {
    id: "fee3_id",
    student_id: student1Mock.id,
    remaining_amount: 200000,
    status: FeeStatusEnum.LATE,
    type: FeeTypeEnum.TUITION,
    comment: "Comment",
    mpbs: [],
    total_amount: 400000,
    creation_datetime: new Date("2021-11-08"),
  },
  {
    id: "fee4_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    total_amount: 400000,
    mpbs: [],
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee5_id",
    student_id: student1Mock.id,
    remaining_amount: 200000,
    mpbs: [],
    status: FeeStatusEnum.UNPAID,
    type: FeeTypeEnum.TUITION,
    comment: "Comment",
    total_amount: 200000,
    creation_datetime: new Date("2022-12-08"),
    due_datetime: new Date("2021-12-09"),
  },
  {
    id: "fee6_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    type: FeeTypeEnum.TUITION,
    mpbs: [
      {
        amount: 0,
        creation_datetime: new Date("2024-04-17"),
        student_id: "student1_id",
        status: "FAILED",
        fee_id: "db6e28ce-ec77-4a7b-8d7a-498500572056",
        psp_id: "MP250420.0816.B96790",
        psp_type: "MVOLA",
      },
    ],
    comment: "Comment",
    total_amount: 20000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee7_id",
    student_id: student1Mock.id,
    remaining_amount: 100000,
    status: FeeStatusEnum.LATE,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    mpbs: [
      {
        amount: 0,
        creation_datetime: new Date("2024-04-17"),
        student_id: "student1_id",
        successfully_verified_on: new Date("2024-04-18"),
        fee_id: "db6e28ce-ec77-4a7b-8d7a-498500572056",
        status: "SUCCESS",
        psp_id: "MP250420.0816.B96790",
        psp_type: "MVOLA",
      },
    ],
    total_amount: 250000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee8_id",
    student_id: student1Mock.id,
    remaining_amount: 50000,
    status: FeeStatusEnum.UNPAID,
    type: FeeTypeEnum.TUITION,
    mpbs: [],
    comment: "Comment",
    total_amount: 50000,
    creation_datetime: new Date("2022-12-08"),
    due_datetime: new Date("2021-12-09"),
  },
  {
    id: "fee9_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    type: FeeTypeEnum.TUITION,
    mpbs: [],
    comment: "Comment",
    total_amount: 25000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee10_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    mpbs: [],
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    total_amount: 250000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee11_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    total_amount: 250000,
    mpbs: [],
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
    letter: {
      id: "string",
      approval_datetime: new Date("2024-10-07"),
      creation_datetime: new Date("2024-10-07"),
      ref: "string",
      status: LetterStatus.REJECTED,
      file_url: "string",
    },
  },
  {
    id: "fee12_id",
    student_id: student1Mock.id,
    remaining_amount: 0,
    status: FeeStatusEnum.PAID,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    total_amount: 250000,
    mpbs: [],
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
    letter: {
      id: "string",
      approval_datetime: new Date("2024-10-07"),
      creation_datetime: new Date("2024-10-07"),
      ref: "string",
      status: LetterStatus.RECEIVED,
      file_url: "string",
    },
  },
];

let newLateFeesMock: Fee[] = [];

export const unverifiedMpbsFee = feesMock[5];

export const rejectedPaymentSlip = feesMock[10];
export const acceptedPaymentSlip = feesMock[11];

export const successMpbsFee = feesMock[6];

export const fee1MockMpbs = {
  amount: 0,
  creation_datetime: new Date("2024-04-17"),
  student_id: fee1Mock.student_id,
  id: "reference orange no 1",
  fee_id: fee1Mock.id,
  psp_id: "MP240726.1541.D88429",
  successfully_verified_on: "",
  last_datetime_verification: "",
  psp_own_datetime_verification: "",
  psp_type: "ORANGE",
  status: "PENDING",
};

feesMock.forEach((e) => {
  let newE: Fee = {
    id: e.id,
    student_id: e.student_id,
    remaining_amount: e.total_amount ? e.total_amount / 2 : 10000,
    status: FeeStatusEnum.LATE,
    type: e.type,
    comment: e.comment,
    mpbs: [],
    total_amount: e.total_amount,
    creation_datetime: e.creation_datetime,
    due_datetime: e.due_datetime,
  };
  newLateFeesMock.push(newE);
});

export const UpdateFeeWithPaymentMock: (fee: Fee, payment: Payment) => Fee = (
  fee,
  payment
) => {
  let newFee = fee;
  newFee.remaining_amount = newFee.remaining_amount
    ? payment.amount
      ? newFee.remaining_amount - payment.amount
      : newFee.remaining_amount
    : newFee.remaining_amount;
  return newFee;
};

export const createFeeWithPredefinedDataMock: (feeDate: string) => Fee[] = (
  feeDate
) => {
  return [
    {
      id: "new_fee_id",
      student_id: student1Mock.id,
      remaining_amount: fee1Mock.total_amount,
      status: FeeStatusEnum.UNPAID,
      mpbs: [],
      type: FeeTypeEnum.TUITION,
      comment: "comment",
      total_amount: fee1Mock.total_amount,
      creation_datetime: new Date(feeDate),
      due_datetime: new Date(feeDate),
    },
  ];
};
export const createFeeWithManualDataMock: (
  date: string,
  amount: number,
  comment: string,
  monthsNumber: number
) => Fee[] = (date, amount, comment, monthsNumber) => {
  let fees: Fee[] = [];
  for (let i = 0; i < monthsNumber; i++) {
    fees.push({
      id: `new_fee_${i + 1}_id{}`,
      student_id: student1Mock.id,
      remaining_amount: amount,
      status: FeeStatusEnum.UNPAID,
      type: FeeTypeEnum.TUITION,
      mpbs: [],
      comment: comment,
      total_amount: amount,
      creation_datetime: new Date(date),
      due_datetime: new Date(date),
    });
  }
  return fees;
};
export const createdFeesForNewStudent: Fee = {
  id: "ajbfq-fqdfjdh-2jkg3j",
  student_id: "STD000001",
  remaining_amount: 1740000,
  status: FeeStatusEnum.UNPAID,
  type: FeeTypeEnum.TUITION,
  comment: "Écolage annuel 1x (2022)",
  total_amount: 1740000,
  creation_datetime: new Date(),
  mpbs: [],
  due_datetime: new Date("2023-01-14"),
};
export const addFeeMock: (fees: Fee[], fee: Fee[]) => Fee[] = (
  fees,
  feesAaded
) => [...feesAaded, ...fees].slice(0, 10);

export const lateFeesMock = newLateFeesMock;

export const feesMpbsMock: Fee[] = [
  {
    id: "fee7_id",
    student_id: student1Mock.id,
    remaining_amount: 100000,
    status: FeeStatusEnum.LATE,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    mpbs: [
      {
        amount: 0,
        creation_datetime: new Date("2024-04-17"),
        student_id: "student1_id",
        fee_id: "db6e28ce-ec77-4a7b-8d7a-498500572056",
        psp_id: "MP250420.0816.B96790",
        status: "PENDING",
        psp_type: "MVOLA",
      },
    ],
    total_amount: 250000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee7_id",
    student_id: student1Mock.id,
    remaining_amount: 100000,
    status: FeeStatusEnum.LATE,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    mpbs: [
      {
        amount: 0,
        creation_datetime: new Date("2024-04-17"),
        student_id: "student1_id",
        successfully_verified_on: new Date("2024-04-18"),
        fee_id: "db6e28ce-ec77-4a7b-8d7a-498500572056",
        status: "SUCCESS",
        psp_id: "MP250420.0816.B96790",
        psp_type: "MVOLA",
      },
    ],
    total_amount: 250000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
  {
    id: "fee7_id",
    student_id: student1Mock.id,
    remaining_amount: 100000,
    status: FeeStatusEnum.LATE,
    type: FeeTypeEnum.HARDWARE,
    comment: "Comment",
    mpbs: [
      {
        amount: 0,
        creation_datetime: new Date("2024-04-17"),
        student_id: "student1_id",
        status: "FAILED",
        successfully_verified_on: new Date("2024-04-18"),
        fee_id: "db6e28ce-ec77-4a7b-8d7a-498500572056",
        psp_id: "MP250420.0816.B96790",
        psp_type: "MVOLA",
      },
    ],
    total_amount: 250000,
    creation_datetime: new Date("2021-11-10"),
    due_datetime: new Date("2021-12-10"),
  },
];

export const succeedMpbs1 = feesMpbsMock[1];
export const pendingMpbs = feesMpbsMock[0];
export const failedMpbs = feesMpbsMock[2];
