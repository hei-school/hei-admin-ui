//to manage the attendance in the localStorage
//--------------------------------------------
export const setAttendance = (newStore = '') => {
  localStorage.setItem('attendance-store', JSON.stringify(newStore))
}
export const getAttendance = () => {
  const data = localStorage.getItem('attendance-store')
  return data ? JSON.parse(data) : []
}
export const deleteFirstAttendance = () => setAttendance(getAttendance().slice(1))
export const addAttendance = newData => setAttendance([...getAttendance(), newData])
export const tryToSendAttendance = newData => {
  //try to send but waiting for the spec

  //if there is an connection error on sending the attendance
  addAttendance(newData)
}
