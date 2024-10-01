import {Fee, Payment, PaymentTypeEnum} from "@haapi/typescript-client";
import {fee1Mock} from "./fees-mocks";

export const payment1Mock: Payment = {
  id: "payment1_id",
  fee_id: fee1Mock.id,
  creation_datetime: new Date("2022-11-11T08:25:26Z"),
  type: PaymentTypeEnum.CASH,
  amount: 200000,
  comment: "Comment",
};

export const createPaymentWithAmountMock: (amount: number) => Payment = (
  amount
) => {
  return {
    id: "payment3_id",
    fee_id: fee1Mock.id,
    creation_datetime: new Date("2022-11-11T08:25:26Z"),
    type: PaymentTypeEnum.CASH,
    amount: amount,
    comment: "Comment",
  };
};

export const addPaymentMock: (
  payments: Payment[],
  payment: Payment
) => Payment[] = (payments, payment) => {
  let newPayments = payments;
  newPayments.push(payment);
  return newPayments.slice(0, 10);
};

export const createPaymentMock: (fee: Fee) => Payment[] = (fee) => {
  let total_amount = fee.total_amount ? fee.total_amount : 0;
  let remaining_amount = fee.remaining_amount ? fee.remaining_amount : 0;
  if (total_amount - remaining_amount === 0) {
    return [];
  }
  return [
    {
      id: `payment1_id`,
      fee_id: fee.id,
      creation_datetime: fee.creation_datetime,
      type: PaymentTypeEnum.CASH,
      amount: total_amount - remaining_amount,
      comment: "Comment",
    },
  ];
};
