import {renderMoney} from "@/operations/common/utils/money";
import {
  FeeSummarySection,
  ReceiptList,
  ReceiptRow,
  SectionTitle,
} from "@/operations/fees/components/FeeInfoSection";
import {PAYMENT_TYPE} from "@/operations/fees/constants";
import {
  PAYMENT_STATUS_ICON,
  PAYMENT_STATUS_LABEL,
} from "@/operations/payments/components/PaymentStatusIcon";
import {Dialog} from "@/ui/components";
import {formatDate} from "@/utils/date";
import {CreditPayment, PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip} from "@mui/material";

interface CreditPaymentDetailsDialogProps {
  payment: CreditPayment;
  onClose: () => void;
}

export const CreditPaymentDetailsDialog = ({
  payment,
  onClose,
}: CreditPaymentDetailsDialogProps) => {
  const status = payment.status as PaymentStatus | undefined;
  const isRejected = status === PaymentStatus.INVALIDATE;
  const validatedByName = [
    payment.validated_by_first_name,
    payment.validated_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const rejectedByName = [
    payment.rejected_by_first_name,
    payment.rejected_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const fee = payment.fee;
  const columnCount = fee ? 2 : 1;
  const columnDivider = {
    borderLeft: {xs: "none", md: "1px solid"},
    borderColor: "divider",
    pl: {xs: 0, md: 3},
  };

  return (
    <Dialog
      title="Détails du paiement par crédit"
      open
      onClose={onClose}
      maxWidth="lg"
    >
      <Box
        p={2.5}
        sx={{
          display: "grid",
          gridTemplateColumns: {xs: "1fr", md: `repeat(${columnCount}, 1fr)`},
          columnGap: 3,
          rowGap: 2,
          alignItems: "start",
        }}
      >
        <Box>
          <SectionTitle>Paiement</SectionTitle>
          <ReceiptList>
            <ReceiptRow
              label="Statut"
              value={
                status ? (
                  <Chip
                    size="small"
                    icon={PAYMENT_STATUS_ICON[status]}
                    label={PAYMENT_STATUS_LABEL[status]}
                  />
                ) : null
              }
            />
            <ReceiptRow
              label="Montant"
              value={
                payment.amount != null ? renderMoney(payment.amount) : null
              }
            />
            <ReceiptRow
              label="Type"
              value={
                payment.type
                  ? ((PAYMENT_TYPE as Record<string, string>)[payment.type] ??
                    payment.type)
                  : null
              }
            />
            <ReceiptRow
              label="Date de paiement"
              value={
                payment.creation_datetime
                  ? formatDate(payment.creation_datetime)
                  : null
              }
            />
            <ReceiptRow label="Commentaire" value={payment.comment} />
            {isRejected ? (
              <>
                <ReceiptRow label="Rejeté par" value={rejectedByName} />
                <ReceiptRow
                  label="Rejeté le"
                  value={
                    payment.rejected_datetime
                      ? formatDate(payment.rejected_datetime)
                      : null
                  }
                />
                <ReceiptRow
                  label="Motif du rejet"
                  value={payment.rejection_reason}
                />
              </>
            ) : (
              <ReceiptRow label="Validé par" value={validatedByName} />
            )}
          </ReceiptList>
        </Box>

        {fee && (
          <Box sx={columnDivider}>
            <FeeSummarySection fee={fee} hideDivider />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
