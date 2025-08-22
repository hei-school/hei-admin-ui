import {
  Cancel,
  CheckCircle,
  ErrorOutline,
  HourglassEmpty,
} from "@mui/icons-material";

export const getStatusChipProps = (status: string, fontSize: number = 16) => {
  switch (status) {
    case "VALIDATED":
      return {
        icon: <CheckCircle sx={{fontSize: fontSize}} />,
        label: "Moyenne Finale",
        color: "success" as const,
        variant: "filled" as const,
      };
    case "INVALIDATED":
      return {
        icon: <Cancel sx={{fontSize: fontSize}} />,
        label: "Non Validé",
        color: "error" as const,
        variant: "filled" as const,
      };
    case "IN_PROGRESS":
      return {
        icon: <HourglassEmpty sx={{fontSize: fontSize}} />,
        label: "Moyenne Provisoire",
        color: "warning" as const,
        variant: "outlined" as const,
      };
    case "INCOMPLETE":
      return {
        icon: <ErrorOutline sx={{fontSize: fontSize}} />,
        label: "Incomplet",
        color: "warning" as const,
        variant: "outlined" as const,
      };
    default:
      return {
        icon: <HourglassEmpty sx={{fontSize: fontSize}} />,
        label: "Non Commencé",
        color: "default" as const,
        variant: "outlined" as const,
      };
  }
};
