import {get27thOfMonth, toUTC} from "../../../utils/date";

// Values filled by FeeInputs; numbers may come as strings from text inputs.
export interface FeeFormValues {
  isPredefinedDate?: boolean;
  isPredefinedFee?: boolean;
  predefinedMonth?: number;
  predefinedYear?: string | number;
  due_datetime?: string | Date;
  amount?: string | number;
  number_of_payments?: string | number;
  category?: string;
  frequency?: string;
  comment?: string;
  type?: string;
}

export interface FeeToCreate {
  type?: string;
  comment?: string;
  total_amount: number;
  student_id?: string;
  due_datetime: string;
  creation_datetime: string;
  category?: string;
  frequency?: string;
}

const createComment = (
  baseComment: string | undefined,
  monthIndex: number,
  numberOfPayemnts: FeeFormValues["number_of_payments"]
) => {
  // add the suffix M(monthValue + 1) when numberOfPayemnts is 9
  // This is based on client requirements.
  return numberOfPayemnts === 9
    ? `${baseComment} (M${monthIndex + 1})`
    : baseComment;
};

const getNextDate = (currentDate: Date, index: number) => {
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + index,
    currentDate.getDate()
  );
};

export const createFeesApi = (
  fees: FeeFormValues,
  studentId?: string
): FeeToCreate[] => {
  const feesToCreate: FeeToCreate[] = [];
  const {
    isPredefinedDate,
    predefinedMonth,
    predefinedYear,
    due_datetime,
    amount,
    number_of_payments,
    category,
    frequency,
    comment,
    type,
  } = fees;
  const firstDueDatetime = new Date(due_datetime ?? Number.NaN);
  const currentDate = new Date().toISOString();

  for (let i = 0; i < Number(number_of_payments); i++) {
    const dueDatetime = isPredefinedDate
      ? get27thOfMonth(Number(predefinedYear), Number(predefinedMonth) + i)
      : getNextDate(
          new Date(firstDueDatetime),
          i /*to get the next date after $i*/
        );

    feesToCreate.push({
      type,
      comment: createComment(
        comment,
        i /* to create the comment suffixed by monthIndex */,
        number_of_payments
      ),
      total_amount: Number(amount),
      student_id: studentId,
      due_datetime: toUTC(dueDatetime).toISOString(),
      creation_datetime: currentDate,
      category,
      frequency,
    });
  }
  return feesToCreate;
};
