import {SmsMessageStatus} from "@haapi-b0fc7615/typescript-client";
import {Chip, ChipProps} from "@mui/material";
import {useRecordContext} from "react-admin";

const SMS_MESSAGE_STATUS_LABEL: Record<SmsMessageStatus, string> = {
  [SmsMessageStatus.PENDING]: "En attente",
  [SmsMessageStatus.DELIVERED]: "Livré",
  [SmsMessageStatus.FAILED]: "Échec",
};

const SMS_MESSAGE_STATUS_COLOR: Record<SmsMessageStatus, ChipProps["color"]> = {
  [SmsMessageStatus.PENDING]: "warning",
  [SmsMessageStatus.DELIVERED]: "success",
  [SmsMessageStatus.FAILED]: "error",
};

export const SmsMessageStatusChip = () => {
  const record = useRecordContext();
  const status = record?.status as SmsMessageStatus | undefined;

  if (!status) {
    return (
      <Chip size="small" variant="outlined" label="Inconnu (envoi groupé)" />
    );
  }

  return (
    <Chip
      size="small"
      label={SMS_MESSAGE_STATUS_LABEL[status]}
      color={SMS_MESSAGE_STATUS_COLOR[status]}
    />
  );
};
