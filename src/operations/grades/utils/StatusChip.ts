import {CourseResultStatus} from "@haapi/typescript-client";
import {Chip} from "@mui/material";
import {styled} from "@mui/material/styles";

interface StatusChipProps {
  status: CourseResultStatus;
  label?: string;
}

const STATUS_COLORS = {
  VALIDATED: {
    main: "#4caf50", // vert
    light: "rgba(76, 175, 80, 0.1)",
    name: "Validé",
  },
  IN_PROGRESS: {
    main: "#ffc107", // jaune
    light: "rgba(255, 193, 7, 0.08)",
    name: "En cours",
  },
  INCOMPLETE: {
    main: "#f44336", // rouge
    light: "rgba(244, 67, 54, 0.08)",
    name: "Incomplet",
  },
  NOT_STARTED: {
    main: "#bdbdbd", // gris
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
