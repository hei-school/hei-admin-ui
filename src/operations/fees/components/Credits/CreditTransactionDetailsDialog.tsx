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
import {
  CreditMovement,
  CreditTransaction,
  PaymentStatus,
} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip} from "@mui/material";

const MOVEMENT_LABEL: Record<string, string> = {
  [CreditMovement.CREDIT]: "Crédit",
  [CreditMovement.DEBIT]: "Débit",
};

const MOVEMENT_COLOR: Record<string, "success" | "error"> = {
  [CreditMovement.CREDIT]: "success",
  [CreditMovement.DEBIT]: "error",
};

interface CreditTransactionDetailsDialogProps {
  transaction: CreditTransaction;
  onClose: () => void;
}

export const CreditTransactionDetailsDialog = ({
  transaction,
  onClose,
}: CreditTransactionDetailsDialogProps) => {
  const fee = transaction.fee;
  const payment = transaction.payment;
  const paymentStatus = payment?.status as PaymentStatus | undefined;
  const validatedByName = [
    payment?.validated_by_first_name,
    payment?.validated_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const columnCount = 1 + [payment, fee].filter(Boolean).length;
  const columnDivider = {
    borderLeft: {xs: "none", md: "1px solid"},
    borderColor: "divider",
    pl: {xs: 0, md: 3},
  };

  return (
    <Dialog
      title="Détails de la transaction de crédit"
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
          <SectionTitle>Transaction</SectionTitle>
          <ReceiptList>
            <ReceiptRow
              label="Mouvement"
              value={
                transaction.movement ? (
                  <Chip
                    size="small"
                    color={MOVEMENT_COLOR[transaction.movement]}
                    label={
                      MOVEMENT_LABEL[transaction.movement] ??
                      transaction.movement
                    }
                  />
                ) : null
              }
            />
            <ReceiptRow
              label="Montant"
              value={
                transaction.amount != null
                  ? renderMoney(transaction.amount)
                  : null
              }
            />
            <ReceiptRow
              label="Date et heure"
              value={
                transaction.date_time ? formatDate(transaction.date_time) : null
              }
            />
          </ReceiptList>
        </Box>

        {payment && (
          <Box sx={columnDivider}>
            <SectionTitle>Paiement lié</SectionTitle>
            <ReceiptList>
              <ReceiptRow
                label="Statut"
                value={
                  paymentStatus && (
                    <Chip
                      size="small"
                      icon={PAYMENT_STATUS_ICON[paymentStatus]}
                      label={PAYMENT_STATUS_LABEL[paymentStatus]}
                    />
                  )
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
              <ReceiptRow label="Validé par" value={validatedByName} />
              <ReceiptRow
                label="Commentaire"
                value={payment.comment}
                fullWidth
              />
            </ReceiptList>
          </Box>
        )}

        {fee && (
          <Box sx={columnDivider}>
            <FeeSummarySection fee={fee} hideDivider />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};
