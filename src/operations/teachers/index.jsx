import {Work} from "@mui/icons-material";
import ProfileEdit from "../profile/ProfileEdit";
import TeacherCreate from "./TeacherCreate";
import TeacherList from "./TeacherList";
import TeacherShow from "./TeacherShow";

const teachers = {
  list: TeacherList,
  edit: <ProfileEdit isOwnProfile={false} />,
  show: TeacherShow,
  create: TeacherCreate,
  icon: Work,
  options: {label: "Enseignants"},
};

export default teachers;
