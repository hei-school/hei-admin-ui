import {SxProps, Theme} from "@mui/material";

export const CELL_SX: SxProps<Theme> = {
  color: "#fff",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontSize: "0.97rem",
  fontWeight: 500,
  py: 1.4,
  px: 2,
} as const;

export const HEADER_CELL_SX: SxProps<Theme> = {
  color: "rgba(255,255,255,0.65)",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  py: 1.2,
  px: 2,
  bgcolor: "rgba(0,0,0,0.2)",
} as const;

export const FILTER_LABEL_SX: SxProps<Theme> = {
  color: "rgba(255,255,255,0.7)",
  fontWeight: 800,
  fontSize: "0.78rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
} as const;

export const SEPARATOR_SX: SxProps<Theme> = {
  width: "1px",
  height: 18,
  bgcolor: "rgba(255,255,255,0.12)",
  flexShrink: 0,
} as const;

export const TABLE_CONTAINER_SX: SxProps<Theme> = {
  bgcolor: "rgba(255,255,255,0.05)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  overflow: "hidden",
} as const;

export const TABLE_HEADER_BOX_SX: SxProps<Theme> = {
  borderBottom: "1px solid rgba(255,255,255,0.1)",
} as const;

export const TABLE_TITLE_SX: SxProps<Theme> = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.95rem",
} as const;

export const LEGEND_TEXT_SX: SxProps<Theme> = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.82rem",
  fontWeight: 500,
} as const;

export const TOTAL_ROW_SX: SxProps<Theme> = {
  bgcolor: "rgba(255,255,255,0.06)",
} as const;

export const TOTAL_LABEL_SX: SxProps<Theme> = {
  ...CELL_SX,
  fontWeight: 900,
  color: "#fff",
  fontSize: "0.88rem",
  letterSpacing: "0.1em",
} as const;

export const PROGRESS_EMPTY_SX: SxProps<Theme> = {
  width: 120,
  height: 3,
  borderRadius: 2,
  bgcolor: "rgba(255,255,255,0.07)",
} as const;

export const PROGRESS_TRACK_SX: SxProps<Theme> = {
  width: 120,
  height: 3,
  borderRadius: 2,
  bgcolor: "rgba(255,255,255,0.1)",
  overflow: "hidden",
} as const;

export const DATE_CHIP_SX: SxProps<Theme> = {
  "bgcolor": "rgba(0,0,0,0.12)",
  "color": "#1a1a1a",
  "fontWeight": 700,
  "fontSize": "0.82rem",
  "border": "1px solid rgba(0,0,0,0.18)",
  "cursor": "pointer",
  "& .MuiChip-icon": {color: "#1a1a1a"},
  "&:hover": {bgcolor: "rgba(0,0,0,0.18)"},
} as const;

export const APPLY_BUTTON_SX = (primaryColor: string): SxProps<Theme> =>
  ({
    bgcolor: primaryColor,
    borderRadius: "8px",
    fontWeight: 700,
    textTransform: "none",
    alignSelf: "flex-end",
    px: 2,
  }) as const;

export const VERIFY_BUTTON_SX: SxProps<Theme> = {
  "borderColor": "rgba(0,0,0,0.5)",
  "color": "#1a1a1a",
  "fontWeight": 800,
  "fontSize": "0.8rem",
  "borderRadius": "8px",
  "textTransform": "uppercase",
  "px": 2,
  "whiteSpace": "nowrap",
  "flexShrink": 0,
  "&:hover": {bgcolor: "rgba(0,0,0,0.08)", borderColor: "#000"},
} as const;

export const EXPORT_CHIP_SX: SxProps<Theme> = {
  "bgcolor": "rgba(255,255,255,0.14)",
  "color": "#fff",
  "fontWeight": 700,
  "fontSize": "0.84rem",
  "height": 30,
  "cursor": "pointer",
  "border": "1px solid rgba(255,255,255,0.3)",
  "& .MuiChip-icon": {color: "rgba(255,255,255,0.85)"},
  "&:hover": {bgcolor: "rgba(255,255,255,0.22)"},
} as const;

export const getChipSx = (active: boolean): SxProps<Theme> => ({
  "bgcolor": active ? "#f1C16B" : "rgba(255,255,255,0.12)",
  "color": active ? "#001948" : "#fff",
  "fontWeight": active ? 800 : 600,
  "fontSize": "0.84rem",
  "height": 28,
  "border": active ? "none" : "1px solid rgba(255,255,255,0.25)",
  "cursor": "pointer",
  "transition": "all 0.15s ease",
  "& .MuiChip-icon": {
    color: active ? "#001948" : "rgba(255,255,255,0.8)",
  },
  "&:hover": {bgcolor: active ? "#f1C16B" : "rgba(255,255,255,0.22)"},
});

export const getLevelChipSx = (
  active: boolean,
  disabled: boolean
): SxProps<Theme> => ({
  "bgcolor": active ? "#f1C16B" : "rgba(255,255,255,0.12)",
  "color": active ? "#001948" : "#fff",
  "fontWeight": active ? 800 : 600,
  "fontSize": "0.84rem",
  "height": 28,
  "border": active ? "none" : "1px solid rgba(255,255,255,0.25)",
  "cursor": disabled ? "not-allowed" : "pointer",
  "opacity": disabled ? 0.5 : 1,
  "transition": "all 0.15s ease",
  "&:hover": {bgcolor: active ? "#f1C16B" : "rgba(255,255,255,0.22)"},
});

export const getViewModeChipSx = (
  active: boolean,
  primaryColor: string
): SxProps<Theme> => ({
  "bgcolor": active ? "white" : "rgba(255,255,255,0.07)",
  "fontWeight": 700,
  "fontSize": "0.84rem",
  "height": 30,
  "cursor": "pointer",
  "border": active ? "none" : "1px solid rgba(255,255,255,0.3)",
  "color": `${active ? primaryColor : "#fff"} !important`,
  "& .MuiChip-label": {
    color: `${active ? primaryColor : "#fff"} !important`,
  },
  "& .MuiChip-icon": {
    color: `${active ? primaryColor : "rgba(255,255,255,0.85)"} !important`,
  },
  "&:hover": {
    "bgcolor": active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
    "& .MuiChip-label": {
      color: `${active ? primaryColor : "#fff"} !important`,
    },
    "& .MuiChip-icon": {
      color: `${active ? primaryColor : "rgba(255,255,255,0.85)"} !important`,
    },
  },
});
