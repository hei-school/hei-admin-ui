function createFeesApi(feestype, firstDueDatetime, isEndOfMonth){
  const feesApi = [];
  const {monthNumber} = feestype;

  for(let i = 0; i < monthNumber; i++){
    updateDueDatetime(firstDueDatetime, isEndOfMonth)
    feesApi.push({...feestype, firstDueDatetime});
  }

  console.log(feesApi)
}

const updateDueDatetime = (currentDate, isEndOfMonth) => {
  currentDate.setMonth(currentDate.getMonth() + 1);
};
