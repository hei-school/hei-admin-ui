import AttendanceList from './list/AttendanceList'
import CreateByList from './create/CreateByList'
import CreateByScan from './create/CreateByScan'

const attendance = {
  list: AttendanceList,
  create: CreateByList,
  scan: CreateByScan
}

export default attendance
