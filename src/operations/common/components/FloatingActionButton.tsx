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
        "bottom": "20px",
        "right": "13vw",
        "zIndex": 1000,
        "backgroundColor": "#2c2c2c",
        "color": "white",
        "borderRadius": "8px",
        "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "padding": "8px 16px",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "gap": "10px",
        "animation": "slideUp 0.3s ease-out",
        "@keyframes slideUp": {
          from: {transform: "translateY(20px)", opacity: 0},
          to: {transform: "translateY(0)", opacity: 1},
        },
        ...containerSx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#4caf50",
          }}
        ></Box>
        <Box sx={{color: "white", fontSize: "0.9rem"}}>
          {count} {getCountLabel()}
        </Box>
      </Box>
      <Button
        label={isLoading ? loadingLabel : actionLabel}
        startIcon={actionIcon}
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          "color": "white !important",
          "backgroundColor": isLoading
            ? "#66bb6a !important"
            : "#4caf50 !important",
          "borderRadius": "4px",
          "textTransform": "none",
          "fontWeight": 500,
          "padding": "6px 12px",
          "&:hover": {
            backgroundColor: "#43a047",
          },
          ...buttonSx,
        }}
      />
    </Box>
  );
};
