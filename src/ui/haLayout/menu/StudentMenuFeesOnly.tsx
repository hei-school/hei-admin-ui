import authProvider from "@/providers/authProvider";
import {SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  AttachMoney as FeesIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

function StudentMenuFeesOnly() {
  const {id: whoamiId} = authProvider.getCachedWhoami();

  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  const BOX_SX = {
    position: "relative",
    overflowY: "auto",
    height: "80%",
  };

  return (
    <Box sx={BOX_SX}>
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
