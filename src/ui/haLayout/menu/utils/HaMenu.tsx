import menuLogo from "@/assets/menu-logo.png";
import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {HaMenuContent} from "@/ui/haLayout/menu/HaMenuContent";
import {SingleMenu} from "@/ui/haLayout/menu/utils/SingleMenu";
import {trackNavClick} from "@/utils/gtm";
import {AccountCircle, Dashboard, Logout} from "@mui/icons-material";
import {Box, Drawer, Typography, styled, useMediaQuery} from "@mui/material";
import {MailQuestion, PhoneCall, Settings} from "lucide-react";
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
  const {role} = useRole();
  const [open] = useSidebarState();
  const isSmall = useMediaQuery("(max-width:920px)");
  const isLarge = useMediaQuery("(min-width:1700px)");
  const {isMonitor, isStudent, isAdmin, isManager} = useRole();

  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };
  const isShown = !isSmall || open;

  const bottomBoxHeight = isMonitor() || isStudent() ? 200 : 110;

  return (
    <Box
      sx={{
        ...MENU_STYLE,
        height: "calc(100vh - 60px)",
        left: isShown ? 0 : "18vw",
        ...sx,
        width: isSmall ? "250px" : "18vw",
        overflow: "hidden",
      }}
      component="div"
      id="ha-menu"
    >
      <Box
        sx={{
          "width": "100%",
          "height": isSmall
            ? `calc(100% - ${bottomBoxHeight + 50}px)`
            : `calc(100% - ${bottomBoxHeight}px)`,
          "overflowY": "auto",
          "overflowX": "hidden",
          "paddingTop": "2.5vh",
          "&::-webkit-scrollbar": {
            width: "4px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgb(255, 255, 255)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "scrollbarWidth": "thin",
          "-ms-overflow-style": "none",
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
        <SingleMenu
          label="Dashboard"
          to="/"
          exact={true}
          icon={<Dashboard />}
          onClick={() => trackNavClick("dashboard", role)}
        />
        <SingleMenu
          label="Profil"
          to="/profile"
          icon={<AccountCircle />}
          onClick={() => trackNavClick("profile", role)}
        />
        <HaMenuContent />
      </Box>

      {isMonitor() || isStudent() ? (
        <Box
          sx={{
            width: isSmall ? "90%" : "100%",
            height: `${bottomBoxHeight}px`,
            borderTop: "1px solid rgba(255, 255, 255, 0.28)",
            shadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            position: "absolute",
            bottom: 1,
            left: 0,
            padding: "10px",
          }}
        >
          <Box
            sx={{
              "background":
                "linear-gradient(165deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)",
              "borderRadius": "10px",
              "color": "white",
              "boxShadow": "0 20px 40px rgba(0,0,0,0.3)",
              "border": "1px solid rgba(255,255,255,0.15)",
              "backdropFilter": "blur(15px)",
              "width": "98%",
              "height": "40px",
              "marginInline": "auto",
              "marginBottom": "20px",
              "position": "relative",
              "overflow": "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  "@keyframes slide": {
                    "0%": {transform: "translateY(0)"},
                    "20%": {transform: "translateY(0)"},
                    "25%": {transform: "translateY(-40px)"},
                    "45%": {transform: "translateY(-40px)"},
                    "50%": {transform: "translateY(-80px)"},
                    "70%": {transform: "translateY(-80px)"},
                    "75%": {transform: "translateY(-120px)"},
                    "95%": {transform: "translateY(-120px)"},
                    "100%": {transform: "translateY(0)"},
                  },
                  "animation": "slide 16s infinite",
                  "position": "absolute",
                  "width": "100%",
                }}
              >
                {[
                  "⚡ Contact d'urgence",
                  "Horaires d'ouverture",
                  "Du lundi au vendredi",
                  "08h à 12h - 13h à 16h",
                ].map((text) => (
                  <Typography
                    key={text}
                    sx={{
                      height: "40px",
                      lineHeight: "40px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#90caf9",
                    }}
                  >
                    {text}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <Box
              sx={{
                "display": "flex",
                "alignItems": "center",
                "gap": 2,
                "padding": "5px",
                "background": "rgba(255,255,255,0.08)",
                "borderRadius": "12px",
                "transition": "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "cursor": "pointer",
                "&:hover": {
                  background: "rgba(255,255,255,0.15)",
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                sx={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PhoneCall size={isLarge ? 24 : 18} />
              </Box>
              <Typography
                sx={{
                  fontSize: isLarge ? "1.1rem" : "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                034 94 041 16
              </Typography>
            </Box>

            <Box
              sx={{
                "display": "flex",
                "alignItems": "center",
                "gap": isLarge ? 2 : 0.5,
                "padding": "5px",
                "background": "rgba(255,255,255,0.08)",
                "borderRadius": "12px",
                "transition": "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "cursor": "pointer",
                "&:hover": {
                  background: "rgba(255,255,255,0.15)",
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                sx={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  padding: isLarge ? "12px" : "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MailQuestion size={isLarge ? 24 : 18} />
              </Box>
              <a
                href="mailto:contact@mail.hei.school"
                target="_blank"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: isLarge ? "1.1rem" : "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                contact@mail.hei.school
              </a>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: `${bottomBoxHeight}px`,
            borderTop: "1px solid rgba(255, 255, 255, 0.28)",
            shadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            position: "absolute",
            display: "flex",
            gap: "1vh",
            flexDirection: "column",
            justifyContent: "center",
            bottom: 0,
            paddingInline: "20px",
            left: 0,
            paddingBlock: "20px",
          }}
        >
          {(isManager() || isAdmin()) && (
            <SingleMenu
              label="Frais prédéfinis"
              to="/fees-templates"
              icon={<Settings />}
            />
          )}
          <SingleMenu
            to=""
            label="Se déconnecter"
            icon={<Logout />}
            onClick={logout}
          />
        </Box>
      )}
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
