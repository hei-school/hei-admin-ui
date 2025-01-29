import menuLogo from "@/assets/menu-logo.png";
import {PALETTE_COLORS} from "@/haTheme";
import UserInfo from "@/ui/haLayout/appBar/UserInfo";
import {AppBar, Box, Typography, useMediaQuery} from "@mui/material";
import {SidebarToggleButton} from "react-admin";

const APPBAR_STYLE = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  color: PALETTE_COLORS.black,
  height: "60px",
  py: 1,
  px: 2,
  backgroundColor: PALETTE_COLORS.white,
  boxShadow: "10px 0px 10px gray",
};

export const HaAppBar = () => {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <AppBar id="appbar" position="sticky" sx={APPBAR_STYLE}>
      {isSmall ? (
        <SidebarToggleButton />
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "250px",
            height: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h2
            id="react-admin-title"
            style={{
              fontSize: "16px",
              padding: 0,
              margin: 0,
              fontWeight: "600",
              color: PALETTE_COLORS.black,
            }}
          >
            {/* title portal here */}
          </h2>
        </Box>
      )}
      <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
        <img alt="hei" src={menuLogo} style={{width: 40, height: 27}} />
        {!isSmall && (
          <Typography
            sx={{
              fontWeight: "bold",
              color: PALETTE_COLORS.black,
              fontSize: "17px",
            }}
          >
            HEI Admin
          </Typography>
        )}
      </Box>
      <UserInfo />
    </AppBar>
  );
};

export default HaAppBar;
