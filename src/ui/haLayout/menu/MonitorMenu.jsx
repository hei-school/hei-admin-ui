import authProvider from "@/providers/authProvider";
import {SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  Newspaper as AnnouncementIcon,
  School as StudentIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

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
