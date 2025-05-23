import Image from "@/assets/qr-code.png";
import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {alpha, Avatar, Box, Drawer, Typography} from "@mui/material";
import {LogOut, X} from "lucide-react";
import {FC} from "react";
import {Button} from "react-admin";

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  imgUrl?: string;
  userRef?: string;
  userName?: string;
  userRole?: string;
}

export const RightDrawer: FC<RightDrawerProps> = ({
  open,
  onClose,
  imgUrl,
  userName,
  userRef,
  userRole,
}) => {
  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={onClose}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "transparent",
          },
        },
      }}
      PaperProps={{
        style: {
          width: "350px",
          right: 0,
          overflow: "hidden",
        },
      }}
    >
      <X
        style={{
          padding: "10px",
          margin: "10px",
          position: "absolute",
          display: "flex",
          fontSize: "2rem",
          borderRadius: "50%",
          top: 0,
          left: 0,
          backgroundColor: alpha(PALETTE_COLORS.yellow, 0.3),
          cursor: "pointer",
        }}
        onClick={onClose}
      />
      <Box
        width="100%"
        marginTop="3vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{
            "position": "relative",
            "padding": "12px",
            "width": "150px",
            "height": "150px",
            "background": "white",
            "borderRadius": "50%",
            "boxShadow": "0 8px 24px rgba(0,0,0,0.12)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "6px",
              left: "6px",
              right: "6px",
              bottom: "6px",
              borderRadius: "2px",
              opacity: 0.6,
            },
          }}
        >
          <Avatar
            src={imgUrl}
            sx={{
              "width": "150px",
              "height": "150px",
              "backgroundColor": PALETTE_COLORS.white,
              "boxShadow": "0 4px 12px rgba(0,0,0,0.08)",
              "transition": "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        </Box>
        <Box
          width="90%"
          textAlign="center"
          display="flex"
          flexDirection="column"
          gap={1.1}
          marginTop="20px"
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: PALETTE_COLORS.primary,
              marginTop: "10px",
            }}
          >
            {userName}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: alpha(PALETTE_COLORS.primary, 0.5),
            }}
          >
            {userRef}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              color: alpha(PALETTE_COLORS.primary, 0.6),
            }}
          >
            {userRole}
          </Typography>
        </Box>
        <Box
          width="90%"
          display="flex"
          flexDirection="column"
          gap={1.5}
          marginTop="10px"
          alignItems="center"
          padding="10px"
          sx={{
            "backgroundColor": alpha("#FF7900", 0.1), // Orange brand color
            "borderRadius": "10px",
            "boxShadow": "0 4px 12px rgba(0,0,0,0.08)",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#FF7900",
              marginBottom: "15px",
            }}
          >
            Code marchand Orange Money
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <Box sx={{display: "flex", gap: "4px"}}>
              {["3", "4", "7", "6", "1", "0"].map((digit, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#000",
                    backgroundColor: "#f5f5f5",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {digit}
                </Typography>
              ))}
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#FF7900",
              marginBottom: "15px",
            }}
          >
            Scannez et payez via Orange Money
          </Typography>
          <img
            src={Image}
            alt="Orange Money QR Code"
            style={{
              width: "70%",
              height: " auto",
              marginTop: "10px",
              borderRadius: "8px",
              padding: "0 auto",
            }}
          />
        </Box>
        <Button
          startIcon={<LogOut fontSize="1rem" />}
          label="Se déconnecter"
          onClick={() => logout()}
          sx={{
            "position": "absolute",
            "bottom": "10px",
            "backgroundColor": alpha(PALETTE_COLORS.primary, 0.3),
            "width": "90%",
            "padding": "10px",
            "fontSize": "1rem",
            "fontWeight": 600,
            "&:hover": {
              backgroundColor: alpha(PALETTE_COLORS.primary, 0.5),
            },
            "&:active": {
              backgroundColor: alpha(PALETTE_COLORS.primary, 0.7),
            },
          }}
        />
      </Box>
    </Drawer>
  );
};
