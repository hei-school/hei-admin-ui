import {PALETTE_COLORS} from "@/haTheme";
import {alpha, Box, Chip, Typography} from "@mui/material";
import {LucideIcon, MoveRight} from "lucide-react";
import {Button, Link} from "react-admin";

interface PendingCountWidgetProps {
  animate: boolean;
  icon: LucideIcon;
  accentColor: string;
  title: string;
  count: number;
  to: string;
  linkLabel: string;
  transitionDelay?: string;
}

export const PendingCountWidget = ({
  animate,
  icon: Icon,
  accentColor,
  title,
  count,
  to,
  linkLabel,
  transitionDelay = "0.7s",
}: PendingCountWidgetProps) => (
  <Box
    sx={{
      mb: 4,
      opacity: animate ? 1 : 0,
      transform: animate ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.5s ease-out ${transitionDelay}`,
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
      width: "100%",
      maxWidth: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box display="flex" gap="1rem">
        <Icon color={accentColor} />
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Chip
        label={`${count} en attente`}
        color="info"
        size="small"
        sx={{
          fontWeight: "bold",
          bgcolor: alpha(accentColor, 0.1),
          color: accentColor,
          border: `1px solid ${alpha(accentColor, 0.2)}`,
        }}
      />
    </Box>
    <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
      <Button
        component={Link}
        variant="text"
        to={to}
        endIcon={
          <MoveRight
            style={{
              fontWeight: 700,
            }}
          />
        }
        sx={{
          "textTransform": "none",
          "padding": "0.3rem 0.8rem",
          "color": accentColor,
          "&:hover": {
            borderColor: PALETTE_COLORS.yellow,
            bgcolor: alpha(PALETTE_COLORS.yellow, 0.1),
            color: PALETTE_COLORS.yellow,
          },
        }}
        label={linkLabel}
      />
    </Box>
  </Box>
);
