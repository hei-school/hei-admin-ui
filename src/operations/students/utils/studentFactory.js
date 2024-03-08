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

  //map student
  let {entrance_datetime, longitude, latitude, ...studentRest} = student;
  entrance_datetime = new Date(entrance_datetime).toISOString();
  const coordinates = {longitude: +longitude, latitude: +latitude};

  return [fees, [{...studentRest, entrance_datetime, coordinates}]];
}
