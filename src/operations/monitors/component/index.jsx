import MonitorStudentList from "@/operations/monitors/component/MonitorStudentList";
import ProfileEdit from "@/operations/profile/ProfileEdit";
import StudentShow from "@/operations/students/StudentShow";
import {Group} from "@mui/icons-material";
import {InsertStudentToMonitor} from "./InsertStudentToMonitor";

const monitorStudent = {
  list: MonitorStudentList,
  edit: <ProfileEdit isOwnProfile={false} isStudent />,
  icon: Group,
  show: <StudentShow />,
  option: {label: "Étudiants"},
  create: <InsertStudentToMonitor />,
};
export default monitorStudent;
