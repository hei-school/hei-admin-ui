import {Box, SxProps} from "@mui/material";
import {ReactNode} from "react";
import {Button} from "react-admin";

interface FloatingActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  count?: number;
  countLabel?: string | ((count: number) => string);
  actionIcon?: ReactNode;
  actionLabel?: string;
  loadingLabel?: string;
  containerSx?: SxProps;
  buttonSx?: SxProps;
}

export const FloatingActionButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  count,
  countLabel,
  actionIcon,
  actionLabel = "Sauvegarder",
  loadingLabel = "Enregistrement...",
  containerSx = {},
  buttonSx = {},
}: FloatingActionButtonProps) => {
  if (!count) return null;

  const getCountLabel = () => {
    if (!countLabel) return "";
    if (typeof countLabel === "function") return countLabel(count);
    return countLabel;
  };

  return (
    <Box
      sx={{
        "position": "fixed",
        "bottom": 24,
        "left": "50%",
        "transform": "translateX(-50%)",
        "backgroundColor": "background.paper",
        "borderRadius": "32px",
        "boxShadow": "0 8px 32px rgba(0, 0, 0, 0.08)",
        "display": "flex",
        "alignItems": "center",
        "gap": 2,
        "padding": "12px 24px",
        "zIndex": 1000,
        "transition": "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
          transform: "translateX(-50%) translateY(-2px)",
        },
        ...containerSx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(45deg, #2196F3, #1976D2)",
          borderRadius: "24px",
          padding: "6px 16px",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: "600",
            mr: 1,
          }}
        >
          {count}
        </Box>
        <Box sx={{color: "white", fontSize: "0.9rem", fontWeight: "500"}}>
          {getCountLabel()}
        </Box>
      </Box>
      <Button
        label={isLoading ? loadingLabel : actionLabel}
        startIcon={actionIcon}
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          "borderRadius": "24px",
          "textTransform": "none",
          "px": 3,
          "py": 1,
          "minHeight": 0,
          "background": "linear-gradient(45deg, #4CAF50, #45a049)",
          "boxShadow": "0 4px 12px rgba(76, 175, 80, 0.2)",
          "transition": "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(45deg, #45a049, #388E3C)",
            boxShadow: "0 6px 16px rgba(76, 175, 80, 0.3)",
          },
          "&:disabled": {
            background: "#9e9e9e",
          },
          ...buttonSx,
        }}
      />
    </Box>
  );
};
