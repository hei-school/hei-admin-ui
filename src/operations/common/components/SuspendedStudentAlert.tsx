import {
  AccessTime,
  Block,
  ContactSupport,
  Info,
  School,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Fade,
  IconButton,
  Slide,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {keyframes} from "@mui/system";
import React, {useEffect, useState} from "react";

const slideInFromLeft = keyframes`
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

interface SuspendedStudentAlertProps {
  studentName?: string;
  suspensionReason?: string;
  contactInfo?: string;
  restrictionMessage?: string;
}

export const SuspendedStudentAlert: React.FC<SuspendedStudentAlertProps> = ({
  studentName = "Cet élève",
  suspensionReason = "Frais de scolarité impayés",
  contactInfo = "Contactez l'administration pour plus d'informations",
  restrictionMessage = "Les notes ne sont pas disponibles dans le tableau de bord",
}) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          position: "relative",
          background: alpha(theme.palette.error.main, 0.04),
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          mt: 3,
          mb: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: theme.palette.error.main,
            opacity: 0.6,
          }}
        />

        <Box sx={{p: 4}}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              mb: 3,
              animation: `${slideInFromLeft} 0.8s ease-out`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 2,
                background: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Block
                sx={{
                  fontSize: 32,
                  color: theme.palette.error.main,
                }}
              />
            </Box>

            <Box sx={{flex: 1}}>
              <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 1}}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.error.main,
                  }}
                >
                  ACCÈS SUSPENDU
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {studentName} actuellement suspendu
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <School fontSize="small" />
                {restrictionMessage}
              </Typography>
            </Box>

            <Tooltip title="Plus d'informations">
              <IconButton
                data-testid="toggle-details-button"
                onClick={handleToggleDetails}
                sx={{
                  "background": alpha(theme.palette.primary.main, 0.1),
                  "border": `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.15),
                  },
                  "transition": "all 0.2s ease",
                }}
              >
                <Info />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Section détails extensible */}
          <Slide direction="down" in={showDetails} mountOnEnter unmountOnExit>
            <Box
              sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                borderRadius: 2,
                p: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                mt: 2,
              }}
            >
              <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                  <AccessTime
                    sx={{
                      color: theme.palette.warning.main,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{fontWeight: 600}}>
                    Raison de la suspension
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    pl: 4,
                  }}
                >
                  {suspensionReason}
                </Typography>

                <Box
                  sx={{display: "flex", alignItems: "center", gap: 2, mt: 2}}
                >
                  <ContactSupport
                    sx={{
                      color: theme.palette.info.main,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{fontWeight: 600}}>
                    Assistance
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    pl: 4,
                  }}
                >
                  {contactInfo}
                </Typography>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Box>
    </Fade>
  );
};
