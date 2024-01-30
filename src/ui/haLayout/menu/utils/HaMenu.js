import {useSidebarState} from "react-admin";
import {Box, Drawer, Typography, useMediaQuery} from "@mui/material";
import {styled} from "@mui/styles";
import {
  AccountCircleOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

import UserInfo from "./UserInfo";
import {HaMenuContent} from "../HaMenuContent";
import {SingleMenu} from "./SingleMenu";

import {useRole} from "../../../../security/hooks";
import {PALETTE_COLORS} from "../../../constants";
import authProvider from "../../../../providers/authProvider";
import menuLogo from "../../../../assets/menu-logo.png";

const MENU_STYLE = {
  width: "250px",
  height: "100%",
  boxSizing: "border-box",
  paddingLeft: "20px",
  transition: "all .3s linear",
  overflowX: "hidden",
  bgcolor: PALETTE_COLORS.black,
  color: PALETTE_COLORS.white,
  top: 0,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
};

const Separator = styled("div")({
  backgroundColor: "rgba(255,255,255,.2)",
  height: 1,
  display: "block",
  width: "300%",
  transform: "translateX(-50%)",
});

export function HaMenuBase({sx = {}}) {
  const [open] = useSidebarState();
  const role = useRole();

  const logout = () => {
    authProvider.logout();
    window.location.reload();
  };

  return (
    <Box
      sx={{...MENU_STYLE, left: open ? 0 : "-250px", ...sx}}
      component="div"
      id="ha-menu"
    >
      <Box sx={{width: "100%"}}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            py: 2.5,
            gap: 2,
          }}
        >
          <img src={menuLogo} style={{width: 40, height: 27}} />
          <Typography
            variant="h1"
            sx={{
              fontSize: "1.1em",
              color: PALETTE_COLORS.white,
              fontWeight: 400,
            }}
          >
            HEI Admin
          </Typography>
        </Box>
        <Separator />
        <UserInfo />
        <Separator />
        <SingleMenu
          label="Profil"
          to="/profile"
          icon={<AccountCircleOutlined />}
          sx={{mt: 3}}
        />
        <HaMenuContent />
      </Box>
      <Box sx={{width: "100%"}}>
        {role.isManager() && (
          <SingleMenu
            label="Frais prédéfinies"
            to="/fees-templates"
            icon={<SettingsOutlined />}
          />
        )}
        <SingleMenu
          label="Se déconnecter"
          icon={<LogoutOutlined />}
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
    <HaMenuBase sx={{position: "fixed"}} />
  );
}
