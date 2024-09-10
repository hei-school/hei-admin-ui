import {Work} from "@mui/icons-material";
import MonitorList from "./MonitorList";
import ProfileEdit from "../profile/ProfileEdit";
import MonitorShow from "./monitorshow";

const monitors = {
  list: MonitorList,
  edit: <ProfileEdit isOwnProfile={false} />,
  show: MonitorShow,
  icon: Work,
  options: {label: "Moniteurs"},
};

export default monitors;
