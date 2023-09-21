import attendanceProvider from '../../providers/attendanceProvider'
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
export const tryToSendAttendance = async attendanceData => {
  attendanceProvider.create(attendanceData)
    .catch(()=>{
      addAttendance(attendanceData)
    })
}

export const ATTENDANCE_TYPE = { CHECK_IN: 'IN', CHECK_OUT: 'OUT' }
export const SCAN_STATUS = { SUCCESS: 'SUCCESS', NO_SCAN: 'NO_SCAN' }
export const AVAILABLE_PLACE = ['Ivandry','Andraharo']
export const qrDefaultConfig = {
  pauseDelay: 1.5,
  boxSize: 250,
  place: AVAILABLE_PLACE[0] 
}
export const setQrConfig = newConfig => {
  localStorage.setItem('qr-config', JSON.stringify(newConfig))
}

export const getQrConfig = () => {
  const config = localStorage.getItem('qr-config')
  return config ? JSON.parse(config) : qrDefaultConfig
}