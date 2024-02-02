import { PALETTE_COLORS } from "../../../constants/palette";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import { HaMenuContent } from "../HaMenuContent";
import { SingleMenu } from "./SingleMenu";
import { useSidebarState } from "react-admin";
import authProvider from "../../../../providers/authProvider";

const MENU_STYLE = {
  width: "250px",
  height: "calc(100% - 60px)",
  boxSizing: "border-box",
  paddingLeft: "20px",
  zIndex: 9999,
  transition: "all .3s linear",
  overflowX: "hidden",
  bgcolor: "#001948",
  color: PALETTE_COLORS.white,
  top: 60,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
};

export function HaMenuBase({ sx = {} }) {
  const [open] = useSidebarState();
  const isSmall = useMediaQuery("(max-width:920px)");

  const logout = () => {
    authProvider.logout();
    window.location.reload();
  };

  return (
    <Box
      sx={{ ...MENU_STYLE, left: (!isSmall || open) ? 0 : "-250px", ...sx }}
      component="div"
      id="ha-menu"
    >
      <Box sx={{ width: "100%" }}>
        <SingleMenu
          label="Profil"
          to="/profile"
          icon={<AccountCircle />}
          sx={{ mt: 3 }}
        />
        <HaMenuContent />
      </Box>
      <Box sx={{ width: "100%" }}>
        <SingleMenu
          label="Se déconnecter"
          icon={<Logout />}
          onClick={logout}
        />
      </Box>
    </Box>
  );
}

export function HaMenu() {
  const isSmall = useMediaQuery("(max-width:920px)");
  const [open, setOpen] = useSidebarState();

  return isSmall ? (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <HaMenuBase />
    </Drawer>
  ) : (
    <HaMenuBase sx={{ position: "fixed" }} />
  );
}
