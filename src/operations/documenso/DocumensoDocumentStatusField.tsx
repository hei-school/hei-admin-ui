import {DocumensoDocumentStatus} from "@haapi-3d601c85/typescript-client";
import {Chip} from "@mui/material";
import {useRecordContext} from "react-admin";

const STATUS_LABELS: Record<DocumensoDocumentStatus, string> = {
  [DocumensoDocumentStatus.PENDING]: "En attente de signature",
  [DocumensoDocumentStatus.COMPLETED]: "Signée",
  [DocumensoDocumentStatus.REJECTED]: "Refusée",
};

const STATUS_COLORS: Record<
  DocumensoDocumentStatus,
  "warning" | "success" | "error"
> = {
  [DocumensoDocumentStatus.PENDING]: "warning",
  [DocumensoDocumentStatus.COMPLETED]: "success",
  [DocumensoDocumentStatus.REJECTED]: "error",
};

const CHIP_SX = {fontWeight: 500};

export const DocumensoDocumentStatusField = () => {
  const record = useRecordContext();
  const status = record?.status as DocumensoDocumentStatus | undefined;

  if (!status) {
    return null;
  }

  return (
    <Chip
      size="small"
      variant="outlined"
      label={STATUS_LABELS[status]}
      color={STATUS_COLORS[status]}
      sx={CHIP_SX}
    />
  );
};
