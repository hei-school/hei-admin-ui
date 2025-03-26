import {createFeesApi} from "../../fees/utils/feeFactory";

export function createStudentApi(payload) {
  const {
    amount,
    comment,
    due_datetime,
    isPredefinedDate,
    isPredefinedFee,
    number_of_payments,
    category,
    frequency,
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
      category,
      frequency,
      number_of_payments,
      predefinedYear,
      predefinedMonth,
      type,
    });
  }

  //map student
  let {entrance_datetime, coordinates, ...studentRest} = student;
  entrance_datetime = new Date(entrance_datetime).toISOString();
  return [
    fees,
    [
      {
        ...studentRest,
        coordinates: {
          latitude: +coordinates.latitude,
          longitude: +coordinates.longitude,
        },
        entrance_datetime,
      },
    ],
  ];
}
