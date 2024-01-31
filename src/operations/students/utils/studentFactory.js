import {createFeesApi} from "../../fees/utils/feeFactory";

export function createStudentApi(payload) {
  const {
    amount,
    comment,
    due_datetime,
    isPredefinedDate,
    isPredefinedFee,
    number_of_payments,
    predefinedYear,
    predefinedMonth,
    type,
    predefinedType,
    canCreateFees,
    ...student
  } = payload;

  let fees = [];

  if (canCreateFees) {
    fees = createFeesApi({
      amount,
      comment,
      due_datetime,
      isPredefinedDate,
      isPredefinedFee,
      number_of_payments,
      predefinedYear,
      predefinedMonth,
      type,
    });
  }

  student.entrance_datetime = new Date(student.entrance_datetime).toISOString();
  return [fees, student];
}
