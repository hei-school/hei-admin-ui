import authProvider from "@/providers/authProvider";
import {SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  Newspaper as AnnouncementIcon,
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
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
        }}
      >
        <SingleMenu
          label="Se déconnecter"
          icon={<LogoutIcon />}
          onClick={() => logout()}
        />
      </Box>
    </Box>
  );
}

export default MonitorMenu;
