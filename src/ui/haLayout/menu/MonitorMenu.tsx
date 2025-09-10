import authProvider from "@/providers/authProvider";
import {SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  Newspaper as AnnouncementIcon,
  Event,
  Logout as LogoutIcon,
  School as StudentIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

function MonitorMenu() {
  const monitorId = authProvider.getCachedWhoami().id;

  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  return (
    <Box sx={{position: "relative"}}>
      <SingleMenu
        to={`/monitors/${monitorId}/students`}
        label="Étudiants"
        icon={<StudentIcon />}
      />
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Présences"
        icon={<Event />}
      />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
      <SingleMenu
        label="Se déconnecter"
        icon={<LogoutIcon />}
        onClick={() => logout()}
      />
    </Box>
  );
}

export default MonitorMenu;
