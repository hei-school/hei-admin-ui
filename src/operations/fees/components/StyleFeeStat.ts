import {Theme} from "@mui/material";
import {SystemStyleObject} from "@mui/system";
import {FeeCategory} from "../types";

const whiteAlpha = (alpha: number) => `rgba(255,255,255,${alpha})`;
const blackAlpha = (alpha: number) => `rgba(0,0,0,${alpha})`;

const WHITE = "#fff";
const DARK_TEXT = "#1a1a1a";
const DEEP_BLUE = "#001948";

export const ACCENT_COLOR = "#f1C16B";

export const HEADER_GRADIENT = `linear-gradient(135deg, ${DEEP_BLUE} 0%, #001B4E 20%, #003CAE 100%)`;

export const FEE_STATUS_COLORS = {
  unpaid: {value: "#e07b7b", header: "#e88080"},
  paid: {value: "#6fcf97", header: "#7de0a0"},
  pending: {value: "#56CCF2", header: "#6dd8f5"},
  late: {value: ACCENT_COLOR, header: "#f5cc7a"},
} as const;

export const DOT_COLOR_BY_CATEGORY: Record<FeeCategory, string> = {
  MONTH: FEE_STATUS_COLORS.pending.value,
  YEAR: ACCENT_COLOR,
  RATTRAPAGE: FEE_STATUS_COLORS.unpaid.value,
  FRAIS_GENERAUX: "#4db6ac",
  ALTERNANT: "#a78bfa",
};

const PAID_RATIO_THRESHOLD = {healthy: 75, fragile: 40} as const;

export const getBarColor = (paidRatio: number): string => {
  if (paidRatio >= PAID_RATIO_THRESHOLD.healthy)
    return FEE_STATUS_COLORS.paid.value;
  if (paidRatio >= PAID_RATIO_THRESHOLD.fragile) return ACCENT_COLOR;
  return FEE_STATUS_COLORS.unpaid.value;
};

const PROGRESS_BAR_SIZE = {width: 120, height: 3} as const;

export const CELL_SX: SystemStyleObject<Theme> = {
  color: WHITE,
  borderBottom: `1px solid ${whiteAlpha(0.08)}`,
  fontSize: "0.97rem",
  fontWeight: 500,
  py: 1.4,
  px: 2,
} as const;

export const HEADER_CELL_SX: SystemStyleObject<Theme> = {
  color: whiteAlpha(0.65),
  borderBottom: `1px solid ${whiteAlpha(0.12)}`,
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  py: 1.2,
  px: 2,
  bgcolor: blackAlpha(0.2),
} as const;

export const FILTER_LABEL_SX: SystemStyleObject<Theme> = {
  color: whiteAlpha(0.7),
  fontWeight: 800,
  fontSize: "0.78rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
} as const;

export const SEPARATOR_SX: SystemStyleObject<Theme> = {
  width: "1px",
  height: 18,
  bgcolor: whiteAlpha(0.12),
  flexShrink: 0,
} as const;

export const TABLE_CONTAINER_SX: SystemStyleObject<Theme> = {
  bgcolor: whiteAlpha(0.05),
  borderRadius: "12px",
  border: `1px solid ${whiteAlpha(0.1)}`,
  overflow: "hidden",
} as const;

export const TABLE_HEADER_BOX_SX: SystemStyleObject<Theme> = {
  borderBottom: `1px solid ${whiteAlpha(0.1)}`,
} as const;

export const TABLE_TITLE_SX: SystemStyleObject<Theme> = {
  color: WHITE,
  fontWeight: 700,
  fontSize: "0.95rem",
} as const;

export const LEGEND_TEXT_SX: SystemStyleObject<Theme> = {
  color: whiteAlpha(0.85),
  fontSize: "0.82rem",
  fontWeight: 500,
} as const;

export const TOTAL_ROW_SX: SystemStyleObject<Theme> = {
  bgcolor: whiteAlpha(0.06),
} as const;

export const TOTAL_LABEL_SX: SystemStyleObject<Theme> = {
  ...CELL_SX,
  fontWeight: 900,
  color: WHITE,
  fontSize: "0.88rem",
  letterSpacing: "0.1em",
} as const;

export const PROGRESS_CELL_SX: SystemStyleObject<Theme> = {
  ...CELL_SX,
  py: 1.5,
  minWidth: 160,
} as const;

export const PROGRESS_EMPTY_SX: SystemStyleObject<Theme> = {
  ...PROGRESS_BAR_SIZE,
  borderRadius: 2,
  bgcolor: whiteAlpha(0.07),
} as const;

export const PROGRESS_TRACK_SX: SystemStyleObject<Theme> = {
  ...PROGRESS_BAR_SIZE,
  borderRadius: 2,
  bgcolor: whiteAlpha(0.1),
  overflow: "hidden",
} as const;

export const MISSING_COUNT_SX: SystemStyleObject<Theme> = {
  color: whiteAlpha(0.25),
  fontWeight: 600,
  fontSize: "0.95rem",
  lineHeight: 1,
} as const;

export const ROW_LABEL_SX: SystemStyleObject<Theme> = {
  color: WHITE,
  fontWeight: 600,
  fontSize: "0.95rem",
} as const;

export const ROW_HOVER_SX: SystemStyleObject<Theme> = {
  "&:hover": {bgcolor: whiteAlpha(0.04)},
} as const;

export const DATE_CHIP_SX: SystemStyleObject<Theme> = {
  "bgcolor": blackAlpha(0.12),
  "color": DARK_TEXT,
  "fontWeight": 700,
  "fontSize": "0.82rem",
  "border": `1px solid ${blackAlpha(0.18)}`,
  "cursor": "pointer",
  "& .MuiChip-icon": {color: DARK_TEXT},
  "&:hover": {bgcolor: blackAlpha(0.18)},
} as const;

export const DATE_POPOVER_PAPER_SX: SystemStyleObject<Theme> = {
  borderRadius: "12px",
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  minWidth: 260,
  boxShadow: `0 8px 32px ${blackAlpha(0.15)}`,
} as const;

export const APPLY_BUTTON_SX = (
  primaryColor: string
): SystemStyleObject<Theme> =>
  ({
    bgcolor: primaryColor,
    borderRadius: "8px",
    fontWeight: 700,
    textTransform: "none",
    alignSelf: "flex-end",
    px: 2,
  }) as const;

export const VERIFY_BUTTON_SX: SystemStyleObject<Theme> = {
  "borderColor": blackAlpha(0.5),
  "color": DARK_TEXT,
  "fontWeight": 800,
  "fontSize": "0.8rem",
  "borderRadius": "8px",
  "textTransform": "uppercase",
  "px": 2,
  "whiteSpace": "nowrap",
  "flexShrink": 0,
  "&:hover": {bgcolor: blackAlpha(0.08), borderColor: "#000"},
} as const;

export const EXPORT_CHIP_SX: SystemStyleObject<Theme> = {
  "bgcolor": whiteAlpha(0.14),
  "color": WHITE,
  "fontWeight": 700,
  "fontSize": "0.84rem",
  "height": 30,
  "cursor": "pointer",
  "border": `1px solid ${whiteAlpha(0.3)}`,
  "& .MuiChip-icon": {color: whiteAlpha(0.85)},
  "&:hover": {bgcolor: whiteAlpha(0.22)},
} as const;

const chipBaseSx = (active: boolean) => ({
  "bgcolor": active ? ACCENT_COLOR : whiteAlpha(0.12),
  "color": active ? DEEP_BLUE : WHITE,
  "fontWeight": active ? 800 : 600,
  "fontSize": "0.84rem",
  "height": 28,
  "border": active ? "none" : `1px solid ${whiteAlpha(0.25)}`,
  "cursor": "pointer",
  "transition": "all 0.15s ease",
  "& .MuiChip-icon": {color: active ? DEEP_BLUE : whiteAlpha(0.8)},
  "&:hover": {bgcolor: active ? ACCENT_COLOR : whiteAlpha(0.22)},
});

export const getChipSx = (active: boolean): SystemStyleObject<Theme> =>
  chipBaseSx(active);

export const getLevelChipSx = (
  active: boolean,
  disabled: boolean
): SystemStyleObject<Theme> => ({
  ...chipBaseSx(active),
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

export const getViewModeChipSx = (
  active: boolean,
  primaryColor: string
): SystemStyleObject<Theme> => {
  const contentColor = `${active ? primaryColor : WHITE} !important`;
  const iconColor = `${active ? primaryColor : whiteAlpha(0.85)} !important`;

  return {
    "bgcolor": active ? WHITE : whiteAlpha(0.07),
    "fontWeight": 700,
    "fontSize": "0.84rem",
    "height": 30,
    "cursor": "pointer",
    "border": active ? "none" : `1px solid ${whiteAlpha(0.3)}`,
    "color": contentColor,
    "& .MuiChip-label": {color: contentColor},
    "& .MuiChip-icon": {color: iconColor},
    "&:hover": {
      "bgcolor": active ? whiteAlpha(0.9) : whiteAlpha(0.15),
      "& .MuiChip-label": {color: contentColor},
      "& .MuiChip-icon": {color: iconColor},
    },
  };
};

export const PROGRESS_LABEL_SX: SystemStyleObject<Theme> = {
  fontWeight: 800,
  fontSize: "1rem",
  lineHeight: 1,
} as const;

export const PROGRESS_TOTAL_LABEL_SX: SystemStyleObject<Theme> = {
  fontWeight: 900,
  fontSize: "1.05rem",
  lineHeight: 1,
} as const;

export const ICON_COLOR = whiteAlpha(0.8);

export const TOOLBAR_ICON_SX: SystemStyleObject<Theme> = {
  fontSize: "1rem !important",
} as const;

export const EXPORT_ICON_SX: SystemStyleObject<Theme> = {
  fontSize: "0.95rem !important",
} as const;

export const STATS_TITLE_SX: SystemStyleObject<Theme> = {
  color: DARK_TEXT,
  fontWeight: 800,
  fontSize: {xs: "1.1rem", sm: "1.3rem"},
  letterSpacing: "-0.01em",
} as const;
