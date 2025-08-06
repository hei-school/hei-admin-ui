import {keyframes} from "@emotion/react";
import {AutoAwesome, Lightbulb, School, Star} from "@mui/icons-material";
import {Box, Fade, Typography, Zoom} from "@mui/material";

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(-1deg);
  }
  75% {
    transform: translateY(-15px) rotate(1deg);
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const EmptyListComponent = ({
  title = "Aucune note pour le moment",
  message = "Commencez à capturer vos idées brillantes",
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <Box
      sx={{
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "alignItems": "center",
        "minHeight": "400px",
        "p": 6,
        "textAlign": "center",
        "position": "relative",
        "background": `
          linear-gradient(135deg, 
            rgba(255, 247, 237, 0.8) 0%, 
            rgba(255, 250, 240, 0.9) 50%, 
            rgba(248, 250, 252, 1) 100%
          )
        `,
        "borderRadius": "24px",
        "border": "1px solid rgba(255, 215, 0, 0.1)",
        "overflow": "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(135, 206, 235, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          animation: `${float} 6s ease-in-out infinite`,
          animationDelay: "0s",
        }}
      >
        <Star sx={{color: "#FFD700", fontSize: 20, opacity: 0.6}} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "25%",
          right: "15%",
          animation: `${sparkle} 3s ease-in-out infinite`,
          animationDelay: "1s",
        }}
      >
        <AutoAwesome sx={{color: "#FF6B6B", fontSize: 16, opacity: 0.7}} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          animation: `${float} 8s ease-in-out infinite`,
          animationDelay: "2s",
        }}
      >
        <Lightbulb sx={{color: "#4ECDC4", fontSize: 18, opacity: 0.5}} />
      </Box>

      <Zoom in timeout={800}>
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            mb: 3,
            animation: `${pulse} 4s ease-in-out infinite`,
          }}
        >
          <Box
            sx={{
              "position": "relative",
              "display": "inline-block",
              "p": 3,
              "borderRadius": "50%",
              "background": `
                linear-gradient(45deg, 
                  rgba(255, 215, 0, 0.1) 0%, 
                  rgba(255, 182, 193, 0.1) 50%, 
                  rgba(135, 206, 235, 0.1) 100%
                )
              `,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: `
                  conic-gradient(
                    from 0deg,
                    #FFD700 0deg,
                    #FF6B6B 120deg,
                    #4ECDC4 240deg,
                    #FFD700 360deg
                  )
                `,
                borderRadius: "50%",
                opacity: 0.3,
                zIndex: -1,
              },
            }}
          >
            <School
              sx={{
                fontSize: 80,
                color: "#6B46C1",
                filter: "drop-shadow(0 8px 16px rgba(107, 70, 193, 0.2))",
              }}
            />
          </Box>
        </Box>
      </Zoom>

      <Fade in timeout={1000}>
        <Box sx={{mb: 4, position: "relative", zIndex: 2}}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(45deg, #6B46C1 30%, #EC4899 90%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            {message}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};
