import {SmsMessageStatus} from "@haapi-b0fc7615/typescript-client";
import {Chip, ChipProps} from "@mui/material";
import {useRecordContext} from "react-admin";

const SMS_MESSAGE_STATUS_LABEL: Record<SmsMessageStatus, string> = {
  [SmsMessageStatus.SCHEDULED]: "Programmé",
  [SmsMessageStatus.PROCESSING]: "Envoi en cours",
  [SmsMessageStatus.ACCEPTED]: "Accepté par l'opérateur",
  [SmsMessageStatus.DELIVERED]: "Livré",
  [SmsMessageStatus.UNDELIVERABLE]: "Non livré",
  [SmsMessageStatus.BLOCKED]: "Bloqué",
  [SmsMessageStatus.FAILED]: "Échec",
  [SmsMessageStatus.UNKNOWN]: "Inconnu",
};

const SMS_MESSAGE_STATUS_COLOR: Record<SmsMessageStatus, ChipProps["color"]> = {
  [SmsMessageStatus.SCHEDULED]: "default",
  [SmsMessageStatus.PROCESSING]: "warning",
  [SmsMessageStatus.ACCEPTED]: "info",
  [SmsMessageStatus.DELIVERED]: "success",
  [SmsMessageStatus.UNDELIVERABLE]: "error",
  [SmsMessageStatus.BLOCKED]: "error",
  [SmsMessageStatus.FAILED]: "error",
  [SmsMessageStatus.UNKNOWN]: "default",
};

export const SmsMessageStatusChip = () => {
  const record = useRecordContext();
  const status = record?.status as SmsMessageStatus | undefined;

  if (!status) {
    return <Chip size="small" variant="outlined" label="Inconnu" />;
  }

  return (
    <Chip
      size="small"
      label={SMS_MESSAGE_STATUS_LABEL[status]}
      color={SMS_MESSAGE_STATUS_COLOR[status]}
    />
  );
};
