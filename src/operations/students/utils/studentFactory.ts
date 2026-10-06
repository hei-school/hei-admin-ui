import {CrupdateStudent} from "@haapi-b0fc7615/typescript-client";
import {createFeesApi} from "../../fees/utils/feeFactory";

export interface StudentFeeFormValues {
  amount?: string | number;
  comment?: string;
  due_datetime?: string;
  isPredefinedDate?: boolean;
  isPredefinedFee?: boolean;
  number_of_payments?: string | number;
  category?: string;
  frequency?: string;
  predefinedYear?: string | number;
  predefinedMonth?: number;
  type?: string;
  predefinedType?: string;
  canCreateFees?: boolean;
}

export type StudentCreateFormValues = StudentFeeFormValues &
  Omit<CrupdateStudent, "entrance_datetime" | "coordinates"> & {
    entrance_datetime: string;
    coordinates: {
      latitude: string | number;
      longitude: string | number;
    };
  };

export const createStudentApi = (payload: StudentCreateFormValues) => {
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

  let fees: ReturnType<typeof createFeesApi> = [];

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
  const {
    entrance_datetime: rawEntranceDatetime,
    coordinates,
    ...studentRest
  } = student;
  const entrance_datetime = new Date(rawEntranceDatetime).toISOString();
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
};
