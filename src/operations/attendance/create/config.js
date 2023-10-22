import { AttendanceMovementType, PlaceEnum } from "../../../gen/haClient"

export const AvailablePlace = Object.entries(PlaceEnum).map(el => (
  { label: el[0], value: el[1] }
))
export const ScanStatus = { Success : 'SUCCESS', NoScan: 'NO_SCAN' }
const defaultConfig = {
  pause: 2,
  fps: 30,
  box: 250,
  send: 10,
  interval: 10_000, //ms
  type: AttendanceMovementType.In,
  place: PlaceEnum.Andraharo 
}

const getConfig = () => {
  const config = localStorage.getItem('qr-config')
  return config ? JSON.parse(config) : defaultConfig 
}
const setConfig = config => localStorage.setItem('qr-config', JSON.stringify({ ...getConfig(), ...config }))

const setAttendance = (newStore = '') => localStorage.setItem('attendance-store', JSON.stringify(newStore))
const getAttendance = () => {
  const data = localStorage.getItem('attendance-store')
  return data ? JSON.parse(data) : []
}
const addAttendance = (studentId, type = getConfig().type)=> {
  const attendance = {
    attedance_mouvement_type: type,
    student_id: studentId,
    created_at: new Date().toISOString(),
    place: qrcode.getConfig().place
  }
  setAttendance([...getAttendance(), attendance])
}

export const qrcode = {
  addAttendance,
  setAttendance,
  getAttendance,
  getConfig,
  setConfig,
  defaultConfig
}
