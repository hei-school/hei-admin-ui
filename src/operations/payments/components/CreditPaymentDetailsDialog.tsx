import {renderMoney} from "@/operations/common/utils/money";
import {
  FeeSummarySection,
  InfoRow,
  SectionTitle,
} from "@/operations/fees/components/FeeInfoSection";
import {PAYMENT_TYPE} from "@/operations/fees/constants";
import {
  PAYMENT_STATUS_ICON,
  PAYMENT_STATUS_LABEL,
} from "@/operations/payments/components/PaymentStatusIcon";
import {Dialog} from "@/ui/components";
import {formatDate} from "@/utils/date";
import {CreditPayment, PaymentStatus} from "@haapi-3d601c85/typescript-client";
import {Box, Chip, Divider} from "@mui/material";

interface CreditPaymentDetailsDialogProps {
  payment: CreditPayment;
  onClose: () => void;
}

export const CreditPaymentDetailsDialog = ({
  payment,
  onClose,
}: CreditPaymentDetailsDialogProps) => {
  const status = payment.status as PaymentStatus | undefined;
  const validatedByName = [
    payment.validated_by_first_name,
    payment.validated_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const fee = payment.fee;

  return (
    <Dialog
      title="Détails du paiement par crédit"
      open
      onClose={onClose}
      maxWidth="sm"
    >
      <Box p={3}>
        <SectionTitle>Paiement</SectionTitle>
        <InfoRow label="Référence" value={payment.id} />
        <InfoRow
          label="Statut"
          value={
            status && (
              <Chip
                size="small"
                icon={PAYMENT_STATUS_ICON[status]}
                label={PAYMENT_STATUS_LABEL[status]}
              />
            )
          }
        />
        <InfoRow
          label="Montant"
          value={payment.amount != null ? renderMoney(payment.amount) : null}
        />
        <InfoRow
          label="Type"
          value={
            payment.type
              ? ((PAYMENT_TYPE as Record<string, string>)[payment.type] ??
                payment.type)
              : null
          }
        />
        <InfoRow
          label="Date de paiement"
          value={
            payment.creation_datetime
              ? formatDate(payment.creation_datetime)
              : null
          }
        />
        <InfoRow label="Commentaire" value={payment.comment} />

        <Divider sx={{my: 2}} />
        <SectionTitle>Validation</SectionTitle>
        <InfoRow label="Validé / rejeté par" value={validatedByName} />
        <InfoRow label="Référence" value={payment.validated_by_ref} />

        {fee && <FeeSummarySection fee={fee} />}
      </Box>
    </Dialog>
  );
};
