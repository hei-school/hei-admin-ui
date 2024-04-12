import { School } from "@mui/icons-material";
import ProfileEdit from "../profile/ProfileEdit";
import StudentShow from "./StudentShow";
import StudentList from "./StudentList";
import StudentCreate from "./StudentCreate";

// /!\ Create ProfileEdit variant: TeacherProfileEdit, StudentProfileEdit
const students = {
  list: StudentList,
  edit: <ProfileEdit isOwnProfile={false} isStudent />,
  show: StudentShow,
  create: StudentCreate,
  icon: School,
  options: { label: "Étudiants" },
};

export default students;
