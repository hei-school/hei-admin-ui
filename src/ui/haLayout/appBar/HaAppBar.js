import {AppBar, Box, Slide, useScrollTrigger} from "@mui/material";
import {
  AppBarClasses,
  LoadingIndicator,
  SidebarToggleButton,
} from "react-admin";
import {PALETTE_COLORS} from "../../constants/palette";
import LogoutMenu from "./LogoutMenu";
import NotificationMenu from "../../notification/NotificationMenu";

export const HaAppBar = () => {
  const trigger = useScrollTrigger();

  const style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    color: PALETTE_COLORS.black,
    boxShadow: "none",
    p: 1,
    backgroundColor: PALETTE_COLORS.yellow,
  };

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar id="appbar" position="sticky" sx={style}>
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <SidebarToggleButton className={AppBarClasses.menuButton} />
          <h2
            id="react-admin-title"
            style={{
              fontSize: "1.2em",
              padding: 0,
              margin: 0,
              fontWeight: "500",
              color: PALETTE_COLORS.black,
            }}
          >
            {/* title portal here */}
          </h2>
        </Box>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <LoadingIndicator sx={{color: PALETTE_COLORS.black}} />
          <NotificationMenu />
          <LogoutMenu />
        </Box>
      </AppBar>
    </Slide>
  );
};

export default HaAppBar;
