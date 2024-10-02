import {Group} from "@mui/icons-material";
import ProfileEdit from "@/operations/profile/ProfileEdit";
import MonitorShow from "@/operations/monitors/MonitorShow";
import MonitorList from "@/operations/monitors/MonitorList";
import MonitorCreate from "@/operations/monitors/MonitorCreate";

const monitors = {
  list: MonitorList,
  edit: <ProfileEdit isOwnProfile={false} isMonitor />,
  show: MonitorShow,
  create: MonitorCreate,
  icon: Group,
  options: {label: "Moniteurs"},
};

export default monitors;