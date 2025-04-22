import menuLogo from "@/assets/menu-logo.png";
import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {HaMenuContent} from "@/ui/haLayout/menu/HaMenuContent";
import {SingleMenu} from "@/ui/haLayout/menu/utils/SingleMenu";
import {AccountCircle, Logout, Settings} from "@mui/icons-material";
import {Box, Drawer, Typography, styled, useMediaQuery} from "@mui/material";
import {MailQuestion, PhoneCall} from "lucide-react";
import {useSidebarState} from "react-admin";

//TODO: create hook useIsSmall

const MENU_STYLE = {
  boxSizing: "border-box",
  paddingLeft: "20px",
  zIndex: 9,
  transition: "all .3s linear",
  overflowX: "hidden",
  overflowY: "auto",
  bgcolor: "#001948",
  color: PALETTE_COLORS.white,
  top: 60,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  position: "fixed",
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
  const isSmall = useMediaQuery("(max-width:920px)");
  const role = useRole();

  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };
  const isShown = !isSmall || open;

  return (
    <Box
      sx={{
        ...MENU_STYLE,
        height: "100vh",
        left: isShown ? 0 : "18vw",
        ...sx,
        width: isSmall ? "250px" : "18vw",
        overflow: "hidden",
      }}
      component="div"
      id="ha-menu"
    >
      {/* All menu  */}
      <Box
        sx={{
          width: "100%",
          height: isSmall ? "100%" : "calc(100% - 200px)",
          overflowY: "scroll",
          paddingTop: "2.5vh",
        }}
      >
        {isSmall && (
          <>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                py: 2.5,
                gap: 2,
              }}
            >
              <img alt="hei" src={menuLogo} style={{width: 40, height: 27}} />
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
          </>
        )}
        <SingleMenu label="Profil" to="/profile" icon={<AccountCircle />} />
        <HaMenuContent />
      </Box>
      {/* bottom section */}
      <Box
        sx={{
          width: "100%",
          height: "200px",
          borderTop: "1px solid rgba(255, 255, 255, 0.28)",
          shadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "10px",
        }}
      >
        {role.isManager() || role.isAdmin() ? (
          <>
            <SingleMenu
              label="Frais prédéfinis"
              to="/fees-templates"
              icon={<Settings />}
            />
            <SingleMenu
              label="Se déconnecter"
              to=""
              icon={<Logout />}
              onClick={logout}
            />
          </>
        ) : (
          <Box
            sx={{
              background:
                "linear-gradient(10deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%)",
              borderRadius: "14px",
              boxShadow: `
                inset -8px -8px 16px rgba(255, 255, 255, 0.1),
                inset 8px 8px 24px rgba(0, 0, 0, 0.3),
                0 8px 24px rgba(0, 0, 0, 0.2)
              `,
              color: "white",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              height: "120px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 1.5,
              padding: 2,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "1.5em",
                color: PALETTE_COLORS.white,
                fontWeight: 800,
              }}
            >
              Contact d'urgence
            </Typography>
            <Box display={"flex"} flexDirection="column">
              <Box display="flex" gap={1}>
                <PhoneCall />
                <Typography fontSize="1.2rem" fontWeight="500">
                  +33 6 12 34 56
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <MailQuestion />
                <a
                  href="mailto:contact@hei.school"
                  target="_blank"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontSize: "1.2rem",
                    fontWeight: "500",
                  }}
                >
                  contact@hei.school
                </a>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function HaMenu() {
  const isSmall = useMediaQuery("(max-width:920px)");
  const [open, setOpen] = useSidebarState();

  return isSmall ? (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      sx={{width: "250px"}}
    >
      <HaMenuBase />
    </Drawer>
  ) : (
    <HaMenuBase />
  );
}
