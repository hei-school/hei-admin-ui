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
export const tryToSendAttendance = attendanceData => {
  attendanceProvider.create(attendanceData).catch(() => {
    addAttendance(attendanceData)
  })
}

export const SCAN_STATUS = { SUCCESS: 'SUCCESS', NO_SCAN: 'NO_SCAN' }
export const AVAILABLE_PLACE = ['Ivandry', 'Andraharo']
export const qrDefaultConfig = {
  pauseDelay: 1.5,
  fps: 30,
  boxSize: 250,
  place: AVAILABLE_PLACE[0]
}
export const setQrConfig = newConfig => {
  let pauseDelay = +newConfig.pauseDelay;
  let fps = +newConfig.fps;

  if(Number.isNaN(pauseDelay)){
    pauseDelay = qrDefaultConfig.pauseDelay
  }
  if(Number.isNaN(fps)){
    fps= qrDefaultConfig.fps
  }
  localStorage.setItem('qr-config', JSON.stringify({...newConfig,fps, pauseDelay}))
}

export const getQrConfig = () => {
  const config = localStorage.getItem('qr-config')
  return config ? JSON.parse(config) : qrDefaultConfig
}
