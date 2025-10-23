import {RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {Cancel, CheckCircle, HourglassEmpty, Search} from "@mui/icons-material";
import {Chip} from "@mui/material";

const COMMON_SIZE = {
  "height": 28,
  "borderRadius": 50,
  "fontSize": 12.5,
  "fontWeight": 500,
  "px": 1.8,
  "& .MuiChip-icon": {
    fontSize: 16,
    marginRight: 0.5,
  },
} as const;

const CHIP_STYLE = {
  ...COMMON_SIZE,
  "& .MuiChip-label": {
    px: 0.5,
  },
} as const;

type ExtendedStatus = RetakeExamStatus | "LOADING";

const STATUS_TEXTS: Record<ExtendedStatus, string> = {
  REGISTERED: "Inscrit",
  TO_CANCEL: "Annulation en attente",
  CANCELED: "Annulé",
  LOADING: "Traitement...",
  INVALIDATE: "Invalidé",
  VALIDATE: "Validé",
};

const STATUS_ICONS: Record<ExtendedStatus, JSX.Element> = {
  REGISTERED: <CheckCircle />,
  TO_CANCEL: <HourglassEmpty />,
  CANCELED: <Cancel />,
  LOADING: <Search />,
  INVALIDATE: <Cancel />,
  VALIDATE: <CheckCircle />,
};

const STATUS_COLORS: Record<
  ExtendedStatus,
  "success" | "warning" | "error" | "info"
> = {
  REGISTERED: "success",
  TO_CANCEL: "warning",
  CANCELED: "error",
  LOADING: "info",
  INVALIDATE: "error",
  VALIDATE: "success",
};

type EnrollStatusProps = {
  status: RetakeExamStatus | "LOADING" | null;
};

export const ButtonStatus = ({status}: EnrollStatusProps) => {
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
