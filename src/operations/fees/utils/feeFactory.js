import {get27thOfMonth, toUTC} from "../../../utils/date";

function createComment(baseComment, monthIndex, numberOfPayemnts) {
  // add the suffix M(monthValue + 1) when numberOfPayemnts is 9
  // This is based on client requirements.
  return numberOfPayemnts === 9
    ? `${baseComment} (M${monthIndex + 1})`
    : baseComment;
}

function getNextDate(currentDate, index) {
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + index,
    currentDate.getDate()
  );
}

export function createFeesApi(fees, studentId) {
  const feesToCreate = [];
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
  const firstDueDatetime = new Date(due_datetime);
  const currentDate = new Date().toISOString();

  for (let i = 0; i < number_of_payments; i++) {
    const dueDatetime = isPredefinedDate
      ? get27thOfMonth(+predefinedYear, predefinedMonth + i)
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
      total_amount: +amount,
      student_id: studentId,
      due_datetime: toUTC(dueDatetime).toISOString(),
      creation_datetime: currentDate,
      category,
      frequency,
    });
  }
  return feesToCreate;
}
