import {CreateByList, CreateByScan} from "./create";
import {AttendanceList} from "./list";

const attendance = {
  list: AttendanceList,
  create: CreateByList,
  scan: CreateByScan,
};

export default attendance;
