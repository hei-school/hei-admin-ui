import {RetakeExamStatus} from "@haapi-3d601c85/typescript-client";
import {Cancel, CheckCircle, HourglassEmpty, Search} from "@mui/icons-material";
import {Chip} from "@mui/material";

const CHIP_STYLE = {
  "height": 28,
  "borderRadius": 50,
  "fontSize": 12.5,
  "fontWeight": 500,
  "px": 1.8,
  "& .MuiChip-icon": {
    fontSize: 16,
    marginRight: 0.5,
  },
  "& .MuiChip-label": {
    px: 0.5,
  },
};

const STATUS_TEXTS = {
  REGISTERED: "Inscrit",
  TO_CANCEL: "Annulation en attente",
  CANCELED: "Annulé",
  LOADING: "Traitement...",
  INVALIDATE: "Invalidé",
  VALIDATE: "Validé",
  REJECT: "Rejeté",
} as const;

const STATUS_ICONS = {
  REGISTERED: <CheckCircle />,
  TO_CANCEL: <HourglassEmpty />,
  CANCELED: <Cancel />,
  LOADING: <Search />,
  INVALIDATE: <Cancel />,
  VALIDATE: <CheckCircle />,
  REJECT: <CheckCircle />,
} as const;

const STATUS_COLORS = {
  REGISTERED: "success",
  TO_CANCEL: "warning",
  CANCELED: "error",
  LOADING: "info",
  INVALIDATE: "error",
  VALIDATE: "success",
  REJECT: "warning",
} as const;

type EnrollStatusProps = {
  status: RetakeExamStatus | "LOADING" | null;
};

export const RetakeExamButtonStatus = ({status}: EnrollStatusProps) => {
  if (!status) return null;

  const label = STATUS_TEXTS[status];
  const icon = STATUS_ICONS[status];
  const color = STATUS_COLORS[status];

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      variant="outlined"
      sx={CHIP_STYLE}
    />
  );
};
