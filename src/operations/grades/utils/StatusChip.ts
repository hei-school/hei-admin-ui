import {
  CourseResultStatus,
  ResultOverviewStatus,
} from "@haapi-3d601c85/typescript-client";
import {Chip, keyframes} from "@mui/material";
import {styled} from "@mui/material/styles";

interface StatusChipProps {
  status: CourseResultStatus | ResultOverviewStatus | string;
  label?: string;
}

const STATUS_COLORS = {
  VALIDATED: {
    main: "#4caf50",
    light: "rgba(76, 175, 80, 0.1)",
    name: "Validé",
  },
  IN_PROGRESS: {
    main: "#ffc107",
    light: "rgba(255, 193, 7, 0.08)",
    name: "En cours",
  },
  INCOMPLETE: {
    main: "#f44336",
    light: "rgba(244, 67, 54, 0.08)",
    name: "Incomplet",
  },
  NOT_STARTED: {
    main: "#bdbdbd",
    light: "rgba(189, 189, 189, 0.15)",
    name: "Non commencé",
  },
  DEFAULT: {
    main: "#e0e0e0",
    light: "rgba(224, 224, 224, 0.15)",
    name: "Inconnu",
  },
} as const;

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<StatusChipProps>(({status}) => {
  const colorSet =
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.DEFAULT;
  return {
    "background": colorSet.light,
    "color": colorSet.main,
    "border": `1.5px solid ${colorSet.main}`,
    "fontWeight": "bold",
    "fontSize": "0.75rem",
    "height": "24px",
    "& .MuiChip-label": {
      padding: "0 8px",
    },
  };
});

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 142, 83, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 142, 83, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 142, 83, 0); }
`;

export const StatusChips = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<StatusChipProps>(({theme, status}) => {
  let styles = {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[800],
    animation: `${pulse} 2s infinite`,
  };

  switch (status) {
    case "VALIDATED":
      styles = {
        backgroundColor: theme.palette.success.light,
        color: "white",
        animation: `${pulse} 2s infinite`,
      };
      break;
    case "IN_PROGRESS":
      styles = {
        backgroundColor: theme.palette.warning.light,
        color: "white",
        animation: `${pulse} 2s infinite`,
      };
      break;
    case "INVALIDATED":
    case "INCOMPLETE":
      styles = {
        backgroundColor: theme.palette.error.light,
        color: "white",
        animation: `${pulse} 2s infinite`,
      };
      break;
    default:
      styles = {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[800],
        animation: `${pulse} 2s infinite`,
      };
      break;
  }

  return {
    ...styles,
    fontWeight: "bold",
  };
});
