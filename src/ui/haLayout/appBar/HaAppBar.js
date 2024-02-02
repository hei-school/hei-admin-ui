import { AppBar, Box, Slide, useScrollTrigger, Typography } from "@mui/material";
import { PALETTE_COLORS } from "../../constants/palette";
import UserInfo from "./UserInfo";
import menuLogo from "../../../assets/menu-logo.png";

const APPBAR_STYLE = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  color: PALETTE_COLORS.black,
  boxShadow: "none",
  height: '60px',
  py: 1,
  px: 2,
  backgroundColor: PALETTE_COLORS.white,
  boxShadow: "10px 0px 10px gray"
};

export const HaAppBar = () => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar id="appbar" position="sticky" sx={APPBAR_STYLE}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={menuLogo} style={{ width: 40, height: 27 }} />
          <Typography sx={{ fontWeight: "bold", color: PALETTE_COLORS.black, fontSize: "17px" }}>
            HEI Admin
          </Typography>
        </Box>
        <UserInfo />
      </AppBar>
    </Slide >
  );
};

export default HaAppBar;
