import {Box} from "@mui/material";
import {
  School as StudentIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import authProvider from "@/providers/authProvider";
import {ListMenu, SingleMenu} from "@/ui/haLayout/menu/utils";
import {HeiListMenuItem} from "@/ui/haLayout/menu/common";

function MonitorMenu() {
  const monitorId = authProvider.getCachedWhoami().id;

  return (
    <Box>
      <SingleMenu
        to={`/monitors/${monitorId}/students`}
        label="Étudiants"
        icon={<StudentIcon />}
      />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
    </Box>
  );
}

export default MonitorMenu;
