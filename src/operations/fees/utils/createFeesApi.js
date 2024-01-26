//Get the end of month after $index months
function getEndOfMonth(predefinedYear, predefinedMonth, index) {
  const dateAfterIndex = new Date(
    +predefinedYear,
    predefinedMonth + index + 1,
    0 
  );
  return dateAfterIndex.toISOString();
}

function createComment(comment, i, number_of_payments){
  return number_of_payments == 9 ? `${comment} (M${i + 1})` : comment ;
}

function getNextDate(currentDate, index) {
  const tempDate = new Date(currentDate);
  tempDate.setMonth(currentDate.getMonth() + index);
  return tempDate.toISOString();
}

export function createFeesApi(payload, studentId) {
  const feesToCreate = [];
  const {
    isPredefinedDate,
    predefinedMonth,
    predefinedYear,
    due_datetime,
    amount,
    number_of_payments,
    comment,
    type,
  } = payload;
  const firstDueDatetime = new Date(due_datetime);

  for (let i = 0; i < number_of_payments; i++) {
    const dueDatetime = isPredefinedDate
      ? getEndOfMonth(predefinedYear, predefinedMonth, i)
      : getNextDate(firstDueDatetime, i);

    feesToCreate.push({
      type,
      comment: createComment(comment, i, number_of_payments),
      total_amount: amount,
      student_id: studentId,
      due_datetime: dueDatetime,
    });
  }
  return feesToCreate;
}
