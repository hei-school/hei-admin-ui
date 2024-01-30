function getEndOfMonth(year, month, index) {
  const dateAfterIndex = new Date(
    year,
    month + index + 1,
    0
  );
  return dateAfterIndex.toISOString();
}

function createComment(baseComment, monthValue, numberOfPayemnts) {
  return numberOfPayemnts === 9 ? `${baseComment} (M${monthValue + 1})` : numberOfPayemnts;
}

function getNextDate(currentDate, index) {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + index, currentDate.getDate());
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
    comment,
    type,
  } = fees;
  const firstDueDatetime = new Date(due_datetime);

  for (let i = 0; i < number_of_payments; i++) {
    const currentIsoDate = new Date().toISOString();
    const dueDatetime = isPredefinedDate
      ? getEndOfMonth(+predefinedYear, predefinedMonth, i)
      : getNextDate(new Date(firstDueDatetime), i /*to get the next date after $i*/);

    feesToCreate.push({
      type,
      comment: createComment(comment, i, number_of_payments),
      total_amount: +amount,
      student_id: studentId,
      due_datetime: dueDatetime,
      creation_datetime: currentIsoDate,
    });
  }
  return feesToCreate;
}
