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
import {useMemo} from "react";
import {useSidebarState} from "react-admin";

const useDeviceInfo = () => {
  const isSmall = useMediaQuery("(max-width:920px)");
  const isLarge = useMediaQuery("(min-width:1700px)");
  const isIOS = useMemo(
    () =>
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
    []
  );

  return {isSmall, isLarge, isIOS};
};

const useMenuState = () => {
  const [open, setOpen] = useSidebarState();
  const {isSmall} = useDeviceInfo();
  const {role, isMonitor, isStudent, isAdmin, isManager} = useRole();

  const isMenuVisible = isSmall ? open : true;
  const bottomBoxHeight = isMonitor() || isStudent() ? 200 : 110;

  return {
    open,
    setOpen,
    isMenuVisible,
    bottomBoxHeight,
    role,
    isMonitor: isMonitor(),
    isStudent: isStudent(),
    isAdmin: isAdmin(),
    isManager: isManager(),
  };
};

const MENU_STYLE = {
  boxSizing: "border-box",
  paddingLeft: "20px",
  zIndex: 9999,
  transition: "all .3s ease-in-out",
  overflowX: "hidden",
  overflowY: "auto",
  bgcolor: "#001948",
  color: PALETTE_COLORS.white,
  top: 60,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  position: "fixed",
  WebkitOverflowScrolling: "touch",
  WebkitTransform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",
  perspective: 1000,
} as const;

const IOS_STYLES = {
  WebkitOverflowScrolling: "touch",
  WebkitTransform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",
  transform: "translate3d(0,0,0)",
} as const;

const Separator = styled("div")({
  backgroundColor: "rgba(255,255,255,.2)",
  height: 1,
  display: "block",
  width: "300%",
  transform: "translateX(-50%)",
});

const MenuHeader = () => {
  const {isSmall} = useDeviceInfo();

  if (!isSmall) return null;

  return (
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
        <img
          alt="HEI Admin"
          src={menuLogo}
          style={{
            width: 40,
            height: 27,
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: "1.1em",
            color: PALETTE_COLORS.white,
            fontWeight: 400,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          HEI Admin
        </Typography>
      </Box>
      <Separator />
    </>
  );
};

interface ContactInfoBoxProps {
  icon: React.ComponentType<any>;
  content: string;
  href?: string;
  isLarge: boolean;
}

const ContactInfoBox = ({
  icon: Icon,
  content,
  href,
  isLarge,
}: ContactInfoBoxProps) => {
  const boxContent = (
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
          padding: isLarge ? "12px" : "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={isLarge ? 24 : 18} />
      </Box>
      <Typography
        sx={{
          fontSize: isLarge ? "1.1rem" : "0.9rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
          WebkitFontSmoothing: "antialiased",
          ...(href && {
            color: "white",
            textDecoration: "none",
          }),
        }}
      >
        {content}
      </Typography>
    </Box>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{textDecoration: "none"}}
    >
      {boxContent}
    </a>
  ) : (
    boxContent
  );
};

const EmergencyContactSection = () => {
  return (
    <Box
      sx={{
        "width": "98%",
        "height": "40px",
        "marginInline": "auto",
        "marginBottom": "20px",
        "position": "relative",
        "overflow": "hidden",
        "background":
          "linear-gradient(165deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)",
        "borderRadius": "10px",
        "color": "white",
        "boxShadow": "0 20px 40px rgba(0,0,0,0.3)",
        "border": "1px solid rgba(255,255,255,0.15)",
        "backdropFilter": "blur(15px)",
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
            "animation": "slide 16s infinite",
            "position": "absolute",
            "width": "100%",
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
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const MenuContent = () => {
  const {role} = useRole();

  return (
    <Box
      sx={{
        "width": "100%",
        "position": "relative",
        "height": "calc(100% - 110px)",
        "overflowY": "auto",
        "overflowX": "hidden",
        "paddingTop": "2.5vh",
        ...IOS_STYLES,
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
        "msOverflowStyle": "none",
      }}
    >
      <MenuHeader />

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
  );
};

const StudentMonitorFooter = () => {
  const {isLarge} = useDeviceInfo();

  return (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        borderTop: "1px solid rgba(255, 255, 255, 0.28)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        position: "absolute",
        bottom: 0,
        left: 0,
        padding: "10px",
        backgroundColor: "#001948",
      }}
    >
      <EmergencyContactSection />

      <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
        <ContactInfoBox
          icon={PhoneCall}
          content="034 94 041 16"
          isLarge={isLarge}
        />
        <ContactInfoBox
          icon={MailQuestion}
          content="contact@mail.hei.school"
          href="mailto:contact@mail.hei.school"
          isLarge={isLarge}
        />
      </Box>
    </Box>
  );
};

const AdminManagerFooter = () => {
  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "110px",
        borderTop: "1px solid rgba(255, 255, 255, 0.28)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        position: "absolute",
        display: "flex",
        gap: "1vh",
        flexDirection: "column",
        justifyContent: "center",
        bottom: 0,
        paddingInline: "20px",
        left: 0,
        paddingBlock: "20px",
        backgroundColor: "#001948",
      }}
    >
      <SingleMenu
        label="Frais prédéfinis"
        to="/fees-templates"
        icon={<Settings />}
      />
      <SingleMenu
        to=""
        label="Se déconnecter"
        icon={<Logout />}
        onClick={logout}
      />
    </Box>
  );
};

interface HaMenuBaseProps {
  sx?: object;
}

export function HaMenuBase({sx = {}}: HaMenuBaseProps) {
  const {isSmall, isIOS} = useDeviceInfo();
  const {isMenuVisible, isMonitor, isStudent} = useMenuState();

  return (
    <Box
      sx={{
        ...MENU_STYLE,
        height: "calc(100vh - 60px)",
        left: isMenuVisible ? 0 : "-100%",
        ...sx,
        width: isSmall ? "250px" : "18vw",
        overflow: "hidden",
        visibility: isMenuVisible ? "visible" : "hidden",
        ...(isIOS && {
          WebkitTransform: isMenuVisible
            ? "translate3d(0,0,0)"
            : "translate3d(-100%,0,0)",
          transform: isMenuVisible
            ? "translate3d(0,0,0)"
            : "translate3d(-100%,0,0)",
        }),
      }}
      id="ha-menu"
    >
      <MenuContent />

      {isMonitor || isStudent ? (
        <StudentMonitorFooter />
      ) : (
        <AdminManagerFooter />
      )}
    </Box>
  );
}

export function HaMenu() {
  const {isSmall, isIOS} = useDeviceInfo();
  const {open, setOpen} = useMenuState();

  if (isSmall) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            backgroundColor: "#001948",
            color: PALETTE_COLORS.white,
            top: 60,
            height: "calc(100vh - 60px)",
            ...(isIOS && IOS_STYLES),
          },
        }}
        ModalProps={{
          disableScrollLock: isIOS,
          BackdropProps: {
            style: {
              backgroundColor: isIOS ? "transparent" : "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <HaMenuBase />
      </Drawer>
    );
  }

  return <HaMenuBase />;
}
