import heroImage from "@/assets/hei-tribe.jpg";
import logo from "@/assets/menu-logo.png";
import {useNotify, UseNotifyOptions} from "@/hooks";
import authProvider from "@/providers/authProvider.ts";
import {getRedirectUrl, goToExternalURL} from "@/security/casdoorSetting";
import {
  AttachMoney,
  LockClock,
  Login as LoginIcon,
  People,
  Security,
  Shield,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ReactNode, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#DFA408",
    },
    secondary: {
      main: "#001948",
    },
    background: {
      default: "#0f172a",
      paper: "rgba(30, 41, 59, 0.8)",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(168, 85, 247, 0.2)",
          background: "rgba(30, 41, 59, 0.75)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
        },
      },
    },
  },
});

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  course: string;
}

const features: Feature[] = [
  {
    icon: <AttachMoney sx={{fontSize: 30, color: "#DFA408"}} />,
    title: "0 Coût à l'arrêt",
    description: "Personne ne se connecte ? Alors personne ne paie.",
    course: "SYS2",
  },
  {
    icon: <Security sx={{fontSize: 30, color: "#DFA408"}} />,
    title: "0 Vulnérabilité",
    description: "Crashtest nous scanne, mais ne trouve rien",
    course: "WEB2",
  },
  {
    icon: <People sx={{fontSize: 30, color: "#DFA408"}} />,
    title: "250,000,000 utilisateurs",
    description: "Onboarder tout Madagascar? Dix fois sans problème",
    course: "DONNEE2",
  },
  {
    icon: <LockClock sx={{fontSize: 30, color: "#DFA408"}} />,
    title: "1 Seconde",
    description: "Pire réponse de notre API au percentile 97",
    course: "PROG2",
  },
];

const FeatureCard = ({icon, title, description, course}: Feature) => {
  const handleCourseClick = () => {
    window.location.href =
      "https://drive.google.com/file/d/1FdooEeAKPO5ucNKXMnyEBZ3RTTE80q7e/view";
  };

  return (
    <Card
      sx={{
        "p": 3,
        "transition": "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 20px 40px -12px rgba(223, 164, 8, 0.2)",
        },
        "border": "1px solid rgba(223, 164, 8, 0.2)",
      }}
    >
      <CardContent sx={{p: 0}}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Paper
            sx={{
              p: 1,
              backgroundColor: "rgba(223, 164, 8, 0.1)",
              borderRadius: 2,
            }}
          >
            {icon}
          </Paper>
          <Box flex={1}>
            <Typography
              variant="h6"
              fontWeight="600"
              color="text.primary"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              mt={1}
            >
              Cours :{" "}
              <Typography
                color="text.primary"
                fontWeight="600"
                sx={{
                  "cursor": "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleCourseClick}
              >
                {course}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AppHeader = () => (
  <Box sx={{mb: 4}}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: {xs: "center", lg: "center"},
        gap: 3,
        mb: 3,
      }}
    >
      <img src={logo} alt="HEI Logo" />
      <Box>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            background:
              "linear-gradient(to right, #f8fafc, rgba(248, 250, 252, 0.7))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: {xs: "2.5rem", lg: "3.5rem"},
          }}
        >
          Admin
        </Typography>
      </Box>
    </Box>
    <Typography
      variant="h6"
      color="text.primary"
      sx={{mb: 4, lineHeight: 1.6, opacity: 0.8}}
    >
      Gérez les étudiants, les enseignants, les course et les opérations de
      manière simple et efficace.
    </Typography>
  </Box>
);

const LoginCard = () => {
  const notify = useNotify();

  const handleCasdoorLogin = (
    notify: (message: string, config?: UseNotifyOptions) => void
  ) => {
    (async () => {
      try {
        const url = await getRedirectUrl();
        goToExternalURL(url);
      } catch (error) {
        notify("Failed to fetch redirect URL", {type: "error"});
      }
    })();
  };

  return (
    <Card sx={{width: "100%", maxWidth: 500, p: 4}}>
      <CardContent>
        <Box sx={{textAlign: "center", mb: 4}}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Bienvenue
          </Typography>
          <Typography color="text.secondary">
            Connectez-vous avec votre compte pour continuer
          </Typography>
        </Box>
        <Button
          onClick={() => handleCasdoorLogin(notify)}
          variant="contained"
          size="large"
          fullWidth
          sx={{
            "py": 2,
            "color": "white",
            "fontSize": "1.125rem",
            "fontWeight": "bold",
            "background": "linear-gradient(135deg, #DFA408, #DFA408)",
            "boxShadow": "0 20px 40px -12px rgba(223, 164, 8, 0.35)",
            "&:hover": {
              opacity: 0.9,
              transform: "scale(1.02)",
            },
            "transition": "all 0.3s ease",
          }}
          startIcon={<LoginIcon />}
          data-testid="casdoor-login-btn"
        >
          Se connecter avec Casdoor
        </Button>
        <Box sx={{mt: 4, pt: 3}}>
          <Divider sx={{mb: 3, borderColor: "rgba(223,164,8,0.44)"}} />
          <Box sx={{textAlign: "center"}}>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
              Authentification sécurisée fournie par
            </Typography>
            <Paper
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                border: "1px solid rgba(223, 164, 8, 0.2)",
              }}
            >
              <Shield sx={{fontSize: 16, color: "#DFA408"}} />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="text.primary"
              >
                Casdoor SSO
              </Typography>
            </Paper>
          </Box>
        </Box>
        <Box sx={{mt: 3, textAlign: "center"}}>
          <Typography variant="caption" color="text.secondary">
            Besoin d’aide ? Contactez votre administrateur système
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function HaLoginPage() {
  const notify = useNotify();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      authProvider.checkAuth().catch((e) => {
        console.error("Authentication check failed : ", e);
      });
      const id = authProvider.getCachedWhoami().id;
      if (id) {
        navigate("/profile");
      }
    } catch (error) {
      notify("Authentication check failed", {type: "error"});
    }
  }, [navigate, notify]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, #a855f7, #6366f1)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            "position": "absolute",
            "inset": 0,
            "backgroundImage": `url(${heroImage})`,
            "backgroundSize": "cover",
            "backgroundPosition": "center",
            "backgroundRepeat": "no-repeat",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(0, 25, 72, 0.95), rgba(0, 25, 72, 0.8), rgba(0, 25, 72, 0.9))",
            },
          }}
        />
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            py: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {xs: "column", lg: "row"},
              alignItems: "center",
              gap: {xs: 4, lg: 8},
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: {lg: 1},
                display: "flex",
                justifyContent: {xs: "center", lg: "flex-start"},
                width: "100%",
              }}
            >
              <LoginCard />
            </Box>
            <Box
              sx={{
                flex: {lg: 2},
                width: "100%",
                textAlign: {xs: "center", lg: "left"},
              }}
            >
              <AppHeader />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr"},
                  gap: 2,
                }}
              >
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: -80,
            width: 160,
            height: 160,
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "25%",
            right: -80,
            width: 240,
            height: 240,
            background: "rgba(99, 102, 241, 0.2)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
