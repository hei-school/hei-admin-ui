import {mapToChoices} from "@/utils/mapToChoices";
import {PaymentStatus} from "@haapi-3d601c85/typescript-client";
import {Cancel, CheckCircle, HourglassEmpty} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {useRecordContext} from "react-admin";

export const PAYMENT_STATUS_ICON: Record<PaymentStatus, JSX.Element> = {
  [PaymentStatus.CREATED]: <HourglassEmpty color="warning" />,
  [PaymentStatus.VALIDATE]: <CheckCircle color="success" />,
  [PaymentStatus.INVALIDATE]: <Cancel color="error" />,
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.CREATED]: "Paiement en attente de validation",
  [PaymentStatus.VALIDATE]: "Paiement validé",
  [PaymentStatus.INVALIDATE]: "Paiement rejeté",
};

export const PAYMENT_STATUS_CHOICES = mapToChoices(
  PAYMENT_STATUS_LABEL,
  "id",
  "name"
);

export const PaymentStatusIcon = () => {
  const record = useRecordContext();
  const status = record?.status as PaymentStatus | undefined;
  return (
    <Tooltip
      title={status ? PAYMENT_STATUS_LABEL[status] : "Statut inconnu"}
      data-testid={`paymentStatusIcon-${record?.id}`}
    >
      <IconButton color="info">
        {status ? (
          PAYMENT_STATUS_ICON[status]
        ) : (
          <HourglassEmpty color="disabled" />
        )}
      </IconButton>
    </Tooltip>
  );
};
