import {Cancel, CheckCircle, HourglassEmpty} from "@mui/icons-material";

export const getStatusChipProps = (status: string) => {
  switch (status) {
    case "VALIDATED":
      return {
        icon: <CheckCircle sx={{fontSize: 16}} />,
        label: "Moyenne Finale",
        color: "success" as const,
        variant: "filled" as const,
      };
    case "INVALIDATED":
      return {
        icon: <Cancel sx={{fontSize: 16}} />,
        label: "Non Validé",
        color: "error" as const,
        variant: "filled" as const,
      };
    case "IN_PROGRESS":
      return {
        icon: <HourglassEmpty sx={{fontSize: 16}} />,
        label: "Moyenne Provisoire",
        color: "warning" as const,
        variant: "outlined" as const,
      };
    case "NOT_STARTED":
      return {
        icon: <HourglassEmpty sx={{fontSize: 16}} />,
        label: "Non Commencé",
        color: "default" as const,
        variant: "outlined" as const,
      };
    default:
      return {
        icon: <HourglassEmpty sx={{fontSize: 16}} />,
        label: "Moyenne Provisoire",
        color: "warning" as const,
        variant: "outlined" as const,
      };
  }
};
