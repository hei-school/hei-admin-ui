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

type EnrollStatusProps = {
  status: RetakeExamStatus | "LOADING" | null;
};
export const ButtonStatus = ({status}: EnrollStatusProps) => {
  switch (status) {
    case "REGISTERED":
      return (
        <Chip
          icon={<CheckCircle />}
          label="Inscrit"
          color="success"
          variant="outlined"
          sx={CHIP_STYLE}
        />
      );

    case "TO_CANCEL":
      return (
        <Chip
          icon={<HourglassEmpty />}
          label="Annulation en attente"
          color="warning"
          variant="outlined"
          sx={CHIP_STYLE}
        />
      );

    case "CANCELED":
      return (
        <Chip
          icon={<Cancel />}
          label="Annulé"
          color="error"
          variant="outlined"
          sx={CHIP_STYLE}
        />
      );

    case "LOADING":
      return (
        <Chip
          icon={<Search />}
          label="Traitement..."
          color="info"
          variant="outlined"
          sx={CHIP_STYLE}
        />
      );

    default:
      return null;
  }
};
