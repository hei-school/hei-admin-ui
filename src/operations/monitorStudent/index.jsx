import {Group} from "@mui/icons-material"; 
import ProfileEdit from "@/operations/profile/ProfileEdit";
import MonitorStudentList from "@/operations/monitorStudent/MonitorStudentList";
import MonitorStudentShow from "@/operations/monitorStudent/MonitorStudentShow";
import MonitorStudentCreate from "@/operations/monitorStudent/MonitorStudentCreate";

const monitorStudent = {
    list: MonitorStudentList,
    edit: <ProfileEdit isOwnProfile={false} isStudent />,
    show: MonitorStudentShow,
    create: MonitorStudentCreate,
    icon: Group,
    option: {label:"Étudiants"}
};
export default monitorStudent;