import {AssignmentInd} from "@mui/icons-material";
import ProfileEdit from "../profile/ProfileEdit";
import {StaffCreate} from "./StaffCreate";
import StaffList from "./StaffList";
import StaffShow from "./StaffShow";

const staffMembers = {
  list: StaffList,
  edit: <ProfileEdit isOwnProfile={false} isStudent={false} isStaff={true} />,
  show: StaffShow,
  create: StaffCreate,
  icon: AssignmentInd,
  options: {label: "Membres Staffs"},
};
export default staffMembers;
