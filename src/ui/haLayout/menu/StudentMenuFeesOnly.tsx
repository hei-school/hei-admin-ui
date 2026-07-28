import authProvider from "@/providers/authProvider";
import {SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  AttachMoney as FeesIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

function StudentMenuFeesOnly() {
  const whoamiId = authProvider.getCachedWhoami().id;

  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  return (
    <Box sx={{position: "relative", overflowY: "auto", height: "80%"}}>
      <SingleMenu
        to={whoamiId ? `/students/${whoamiId}/fees` : "/"}
        label="Frais"
        icon={<FeesIcon />}
      />
      <SingleMenu
        label="Se déconnecter"
        icon={<LogoutIcon />}
        onClick={() => logout()}
      />
    </Box>
  );
}

export default StudentMenuFeesOnly;