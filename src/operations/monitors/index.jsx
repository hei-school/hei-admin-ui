import MonitorCreate from "@/operations/monitors/MonitorCreate";
import MonitorList from "@/operations/monitors/MonitorList";
import MonitorShow from "@/operations/monitors/MonitorShow";
import ProfileEdit from "@/operations/profile/ProfileEdit";
import {Group} from "@mui/icons-material";

const monitors = {
  list: MonitorList,
  edit: <ProfileEdit isOwnProfile={false} isMonitor />,
  show: MonitorShow,
  create: MonitorCreate,
  icon: Group,
  options: {label: "Moniteurs"},
};

export default monitors;
