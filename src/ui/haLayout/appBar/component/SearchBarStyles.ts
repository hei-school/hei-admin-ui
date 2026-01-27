import {alpha} from "@mui/material";

export const COLORS = {
  primary: "#1976d2",
  background: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#666666",
  border: "#dee2e6",
  backdrop: "rgba(0, 0, 0, 0.45)",
};

export const SX_BACKDROP = {
  position: "fixed",
  inset: 0,
  backgroundColor: COLORS.backdrop,
  zIndex: 14000,
};

export const SX_SEARCH_TRIGGER = {
  width: 300,
  height: 40,
  border: `2px solid ${COLORS.border}`,
  borderRadius: 12,
  px: 2,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: COLORS.background,
  boxShadow: `0 4px 12px ${alpha(COLORS.text, 0.1)}`,
};

export const SX_SEARCH_TRIGGER_PLACEHOLDER = {
  color: COLORS.textSecondary,
};

export const SX_ACTIVE_CONTAINER = {
  position: "fixed",
  top: "30%",
  left: "35%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  zIndex: 14001,
};

export const SX_ACTIVE_INPUT_WRAPPER = {
  display: "flex",
  alignItems: "center",
  height: 50,
  px: 2.5,
  borderRadius: 16,
  border: `2px solid ${COLORS.primary}`,
  backgroundColor: COLORS.background,
  boxShadow: `0 12px 40px ${alpha(COLORS.backdrop, 0.35)}`,
};

export const SX_INPUT = {
  flex: 1,
  fontSize: 17,
  fontWeight: 500,
};
