import { AttendanceMovementType, PlaceEnum } from "../../../gen/haClient"

export const AvailablePlace = Object.entries(PlaceEnum).map(el => (
  { label: el[0], value: el[1] }
))
export const ScanStatus = { Success : 'SUCCESS', NoScan: 'NO_SCAN' }
const defaultConfig = {
  pause: 1.5,
  fps: 30,
  box: 250,
  send: 10,
  interval: 10_000,
  type: AttendanceMovementType.In,
  place: PlaceEnum.Andraharo 
}

const getConfig = () => {
  const config = localStorage.getItem('qr-config')
  return config ? JSON.parse(config) : defaultConfig 
}
const setConfig = config => {
  const pause= !isNaN(+config.pause) ? +config.pause: defaultConfig.pause
  const fps = !isNaN(+config.fps) ? +config.fps : defaultConfig.fps
  localStorage.setItem('qr-config', JSON.stringify({ ...getConfig(), ...config, fps, pause }))
}
const setAttendance = (newStore = '') => {
  localStorage.setItem('attendance-store', JSON.stringify(newStore))
}
const getAttendance = () => {
  const data = localStorage.getItem('attendance-store')
  return data ? JSON.parse(data) : []
}
const deleteAttendance = () => setAttendance(getAttendance().slice(getConfig().send))
const addAttendance = (studentId, type = getConfig().type)=> {
  const attendance = {
    attedance_mouvement_type: type,
    student_id: studentId,
    created_at: new Date().toISOString(),
    place: qrcode.getConfig().place
  }
  setAttendance([...getAttendance(), attendance])

  console.log(attendance)
}

export const qrcode = {
  addAttendance,
  deleteAttendance,
  getAttendance,
  getConfig,
  setConfig,
  defaultConfig
}
