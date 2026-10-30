import {ComplaintStatus} from "@haapi-3d601c85/typescript-client";
import {Chip} from "@mui/material";
import {
  COMPLAINT_STATUS_COLORS,
  COMPLAINT_STATUS_LABELS,
} from "../utils/constants";

export const ComplaintStatusChip = ({
  status,
}: Readonly<{status?: ComplaintStatus}>) => {
  if (!status) return null;
  return (
    <Chip
      label={COMPLAINT_STATUS_LABELS[status]}
      color={COMPLAINT_STATUS_COLORS[status]}
      size="small"
      variant="outlined"
    />
  );
};
