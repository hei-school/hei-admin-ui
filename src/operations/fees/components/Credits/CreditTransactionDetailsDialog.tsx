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
import {
  CreditMovement,
  CreditTransaction,
  PaymentStatus,
} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip, Divider} from "@mui/material";

const MOVEMENT_LABEL: Record<string, string> = {
  [CreditMovement.CREDIT]: "Crédit",
  [CreditMovement.DEBIT]: "Débit",
};

interface CreditTransactionDetailsDialogProps {
  transaction: CreditTransaction;
  onClose: () => void;
}

export const CreditTransactionDetailsDialog = ({
  transaction,
  onClose,
}: CreditTransactionDetailsDialogProps) => {
  const student = transaction.credit?.student;
  const fee = transaction.fee;
  const payment = transaction.payment;
  const paymentStatus = payment?.status as PaymentStatus | undefined;
  const validatedByName = [
    payment?.validated_by_first_name,
    payment?.validated_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog
      title="Détails de la transaction de crédit"
      open
      onClose={onClose}
      maxWidth="sm"
    >
      <Box p={3}>
        <SectionTitle>Transaction</SectionTitle>
        <InfoRow label="Référence" value={transaction.transaction_id} />
        <InfoRow
          label="Mouvement"
          value={
            transaction.movement
              ? (MOVEMENT_LABEL[transaction.movement] ?? transaction.movement)
              : null
          }
        />
        <InfoRow
          label="Montant"
          value={
            transaction.amount != null ? renderMoney(transaction.amount) : null
          }
        />
        <InfoRow
          label="Date"
          value={
            transaction.date_time ? formatDate(transaction.date_time) : null
          }
        />

        <Divider sx={{my: 2}} />
        <SectionTitle>Étudiant</SectionTitle>
        <InfoRow
          label="Nom"
          value={[student?.first_name, student?.last_name]
            .filter(Boolean)
            .join(" ")}
        />
        <InfoRow label="Référence" value={student?.ref} />
        <InfoRow label="Email" value={student?.email} />
        <InfoRow
          label="Solde de crédit"
          value={
            transaction.credit?.amount != null
              ? renderMoney(transaction.credit.amount)
              : null
          }
        />

        {payment && (
          <>
            <Divider sx={{my: 2}} />
            <SectionTitle>Paiement lié</SectionTitle>
            <InfoRow label="Référence" value={payment.id} />
            <InfoRow
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
            <InfoRow
              label="Montant"
              value={
                payment.amount != null ? renderMoney(payment.amount) : null
              }
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
            <InfoRow label="Validé / rejeté par" value={validatedByName} />
            <InfoRow
              label="Référence du validateur"
              value={payment.validated_by_ref}
            />
          </>
        )}

        {fee && <FeeSummarySection fee={fee} />}
      </Box>
    </Dialog>
  );
};
