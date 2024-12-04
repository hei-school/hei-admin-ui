import {AssignmentInd} from "@mui/icons-material";
import ProfileEdit from "../profile/ProfileEdit";
import StaffList from "./StaffList";
import StaffShow from "./StaffShow";

const staffMembers = {
  list: StaffList,
  edit: (
    <ProfileEdit isOwnProfile={false} isStudent={false} isStaffProfil={true} />
  ),
  show: StaffShow,
  icon: AssignmentInd,
  options: {label: "Membres Staffs"},
};
export default staffMembers;
