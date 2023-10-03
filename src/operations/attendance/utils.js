import { AVAILABLE_PLACE, attendanceToSend } from "../../conf"

export const SCAN_STATUS = { SUCCESS: 'SUCCESS', NO_SCAN: 'NO_SCAN' }
export const qrDefaultConfig = {
  pauseDelay: 1.5,
  fps: 30,
  boxSize: 250,
  place: AVAILABLE_PLACE[0]
}

export const setQrConfig = newConfig => {
  const pauseDelay = !isNaN(+newConfig.pauseDelay) ? +newConfig.pauseDelay: qrDefaultConfig.pauseDelay
  const fps = !isNaN(+newConfig.fps) ? +newConfig.fps : qrDefaultConfig.fps
  
  localStorage.setItem('qr-config', JSON.stringify({...newConfig,fps, pauseDelay}))
}

export const setAttendance = (newStore = '') => {
  localStorage.setItem('attendance-store', JSON.stringify(newStore))
}

export const getAttendance = () => {
  const data = localStorage.getItem('attendance-store')
  return data ? JSON.parse(data) : []
}

export const deleteFirstSlice = () => setAttendance(getAttendance().slice(attendanceToSend))
export const addAttendance = newData => setAttendance([...getAttendance(), newData])

export const getQrConfig = () => {
  const config = localStorage.getItem('qr-config')
  return config ? JSON.parse(config) : qrDefaultConfig
}