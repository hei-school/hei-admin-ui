import {Box, Typography} from "@mui/material";
import {ArrowUp} from "lucide-react";
import {useNotify} from "react-admin";

import Image from "@/assets/qr-code.png";

export const OrangeMoneyHeader = () => {
  const notify = useNotify();
  const merchantCode = "317610";

  const handleCopyMerchantCode = () => {
    navigator.clipboard
      .writeText(merchantCode)
      .then(() => {
        notify("Code marchand copié!", {type: "success"});
      })
      .catch(() => {
        notify("Impossible de copier le code", {type: "error"});
      });
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg,rgba(255, 102, 0, 0.6) 0%,rgba(255, 140, 0, 0.5) 100%)",
        borderRadius: "12px",
        marginTop: "12px",
        padding: "10px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(255, 102, 0, 0.2)",
        marginBottom: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {xs: "column", md: "row"},
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
          gap: {xs: 5, md: 3},
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: {xs: "center", md: "left"},
            position: "relative",
            zIndex: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginRight: "5px",
              opacity: 0.9,
              mb: 0.5,
              color: "white",
              display: "inline-block",
            }}
          >
            Payer avec
          </Typography>
          <Typography
            variant="h4"
            sx={{
              "fontWeight": 700,
              "fontSize": {xs: "1.8rem", md: "2rem"},
              "letterSpacing": "2px",
              "mb": 0.5,
              "position": "relative",
              "display": "inline-block",
              "color": "white",
              "&::after": {
                content: "''",
                position: "absolute",
                bottom: -5,
                left: 0,
                width: {xs: "100%", md: "80%"},
                height: "3px",
                background:
                  "linear-gradient(90deg,rgb(21, 84, 202) 0%, rgba(115, 158, 236, 0.5) 70%)",
                borderRadius: "2px",
              },
            }}
          >
            ORANGE
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: {xs: "3rem", md: "3.5rem"},
              letterSpacing: "1px",
              lineHeight: 1,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              mb: 2,
              background:
                "linear-gradient(90deg, #001948 0%,rgb(16, 86, 165) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            MONEY
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              fontSize: "0.95rem",
              opacity: 0.9,
              maxWidth: "250px",
              lineHeight: 1.5,
              color: "white",
            }}
          >
            Scannez le QR code pour effectuer votre paiement en toute sécurité
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              "width": "200px",
              "height": "200px",
              "background": "white",
              "borderRadius": "16px",
              "display": "flex",
              "alignItems": "center",
              "justifyContent": "center",
              "padding": "6px",
              "boxShadow":
                "0 10px 25px rgba(0,0,0,0.1), 0 0 15px rgba(106, 17, 203, 0.1)",
              "position": "relative",
              "transform": "rotate(0deg)",
              "transition": "all 0.4s ease",
              "&:hover": {
                transform: "rotate(2deg) scale(1.03)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,0.15), 0 0 20px rgba(106, 17, 203, 0.2)",
              },
              "&::before": {
                content: "''",
                position: "absolute",
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                background:
                  "linear-gradient(45deg, rgba(142,68,173,0.3) 0%, rgba(255,255,255,0.3) 100%)",
                borderRadius: "20px",
                zIndex: -1,
                opacity: 0.5,
                filter: "blur(8px)",
              },
            }}
          >
            <Box
              sx={{
                "width": "95%",
                "height": "95%",
                "border": "2px solid #8E44AD",
                "borderRadius": "12px",
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "center",
                "overflow": "hidden",
                "position": "relative",
                "&::after": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                  zIndex: 2,
                },
              }}
            >
              <Box
                component="img"
                src={Image}
                sx={{
                  "width": "100%",
                  "height": "100%",
                  "objectFit": "cover",
                  "transition": "transform 0.5s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(106,17,203,0.1)",
              backdropFilter: "blur(5px)",
              padding: "8px 16px",
              borderRadius: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid rgba(106,17,203,0.2)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                fontSize: "0.95rem",
                letterSpacing: "0.5px",
              }}
            >
              <Box
                component="span"
                sx={{
                  "width": "10px",
                  "height": "10px",
                  "borderRadius": "50%",
                  "backgroundColor": "#4CAF50",
                  "display": "inline-block",
                  "mr": 1.5,
                  "boxShadow": "0 0 8px #4CAF50",
                  "animation": "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
                    },
                    "70%": {
                      boxShadow: "0 0 0 6px rgba(76, 175, 80, 0)",
                    },
                    "100%": {
                      boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
                    },
                  },
                }}
              />
              Scan to Pay
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            "flex": 1,
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "justifyContent": "center",
            "background": "rgba(106, 17, 203, 0.08)",
            "backdropFilter": "blur(12px)",
            "borderRadius": "16px",
            "padding": "24px",
            "boxShadow":
              "0 8px 20px rgba(0,0,0,0.1), 0 0 15px rgba(106, 17, 203, 0.05) inset",
            "border": "1px solid rgba(106, 17, 203, 0.15)",
            "transition": "all 0.4s ease",
            "position": "relative",
            "overflow": "hidden",
            "zIndex": 3,
            "&:hover": {
              background: "rgba(106, 17, 203, 0.12)",
              transform: "translateY(-5px)",
              boxShadow:
                "0 12px 28px rgba(0,0,0,0.15), 0 0 20px rgba(106, 17, 203, 0.1) inset",
            },
            "&::before": {
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
              zIndex: -1,
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              "color": "white",
              "fontWeight": 600,
              "mb": 2.5,
              "textTransform": "uppercase",
              "letterSpacing": "2px",
              "position": "relative",
              "display": "inline-block",
              "&::after": {
                content: "''",
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "3px",
                background:
                  "linear-gradient(90deg, rgba(255,102,0,0.8) 0%, rgba(255,255,255,0.8) 100%)",
                borderRadius: "2px",
              },
            }}
          >
            CODE MARCHAND
          </Typography>

          <Box
            onClick={handleCopyMerchantCode}
            sx={{
              "display": "flex",
              "justifyContent": "center",
              "gap": "5px",
              "mb": 3,
              "cursor": "pointer",
              "transition": "all 0.3s ease",
              "background": "rgba(255, 102, 0, 0.15)",
              "borderRadius": "12px",
              "border": "1px solid rgba(255, 102, 0, 0.3)",
              "&:hover": {
                transform: "scale(1.05)",
                background: "rgba(255, 102, 0, 0.25)",
                boxShadow: "0 5px 15px rgba(255, 102, 0, 0.2)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            {merchantCode.split("").map((digit, index) => (
              <Box
                key={index}
                sx={{
                  "width": "38px",
                  "height": "40px",
                  "border": "1px solid rgba(255, 255, 255, 0.4)",
                  "borderRadius": "8px",
                  "display": "flex",
                  "alignItems": "center",
                  "justifyContent": "center",
                  "fontFamily": '"Courier New", monospace',
                  "fontWeight": 800,
                  "fontSize": "2rem",
                  "color": "white",
                  "background":
                    "linear-gradient(135deg, rgba(255, 102, 0, 0.4) 0%, rgba(255, 102, 0, 0.2) 100%)",
                  "boxShadow":
                    "0 4px 8px rgba(0,0,0,0.15), inset 0 0 10px rgba(255, 102, 0, 0.1)",
                  "textShadow": "0 2px 3px rgba(0,0,0,0.2)",
                  "position": "relative",
                  "overflow": "hidden",
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                    borderRadius: "8px 8px 0 0",
                  },
                }}
              >
                {digit}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              "display": "flex",
              "alignItems": "center",
              "justifyContent": "center",
              "gap": 1,
              "background": "rgba(255,255,255,0.1)",
              "padding": "4px 12px",
              "borderRadius": "20px",
              "boxShadow": "0 2px 8px rgba(0,0,0,0.1)",
              "border": "1px solid rgba(255,255,255,0.1)",
              "transition": "all 0.3s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ArrowUp
              style={{
                fontSize: "0.85rem",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
              }}
            >
              Cliquez pour copier
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "5%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "white",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "white",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "30%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "white",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
