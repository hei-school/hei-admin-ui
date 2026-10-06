import {PALETTE_COLORS} from "@/haTheme";
import {ButtonProps, TypographyProps} from "@mui/material";

export const COMMON_BUTTON_PROPS = {
  size: "small",
  variant: "contained",
  style: {
    backgroundColor: PALETTE_COLORS.primary,
    color: PALETTE_COLORS.white,
    marginTop: "15px",
    marginLeft: "5px",
  },
} satisfies ButtonProps;

export const COMMON_OUTLINED_BUTTON_PROPS = {
  size: "medium",
  variant: "outlined",
  style: {
    backgroundColor: PALETTE_COLORS.white,
    color: PALETTE_COLORS.primary,
    padding: "0.5rem 1.5rem",
    borderRadius: "0.4rem",
    width: "100%",
  },
} satisfies ButtonProps;

export const COMMON_FIELD_ATTRIBUTES = {
  variant: "caption",
  color: PALETTE_COLORS.typography.grey,
} satisfies TypographyProps;

export const CONFIRM_DIALOG_Z_INDEX = 99999;
