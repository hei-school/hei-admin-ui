function createComment(comment,i){
  return `${comment} M${i}`
}

//Get the end of month after $index months
function getEndOfMonth(predefinedYear, predefinedMonth, index){
  const dateAfterIndex = new Date(+predefinedYear, predefinedMonth + index, 1);
  // dateAfterIndex.setDate(dateAfterIndex.getDate() + 1);
  return dateAfterIndex.toISOString();
};

function getNextDate({...currentDate}, index){
  currentDate.setMonth(currentDate.getMonth() + index);
  return currentDate.toISOString();
}

export function createFeesApi(feesRecord, studentId){
  const feesToCreate = [];
  const {
    isPredefinedDate, 
    predefinedMonth, 
    predefinedYear, 
    due_datetime,
    amount,
    number_of_payments,
    comment,
    type
  } = feesRecord;
  const firstDueDatetime = new Date(due_datetime);
  
  for(let i = 0; i < number_of_payments; i++){
    const dueDatetime = isPredefinedDate 
      ? getEndOfMonth(predefinedYear, predefinedMonth, i + 1) 
      : getNextDate(firstDueDatetime, i);

    feesToCreate.push({
      type,
      comment: createComment(comment, i + 1),
      total_amount: amount,
      student_id: studentId,
      due_datetime: dueDatetime
    })
  }

  console.log(feesToCreate);

  return [[]];
}
