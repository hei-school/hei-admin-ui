import {renderMoney} from "@/operations/common/utils/money";
import {CATEGORY, PAYMENT_TYPE} from "@/operations/fees/constants";
import {
  PAYMENT_STATUS_ICON,
  PAYMENT_STATUS_LABEL,
} from "@/operations/payments/components/PaymentStatusIcon";
import {Dialog} from "@/ui/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {
  CreditMovement,
  CreditTransaction,
  PaymentStatus,
} from "@haapi-3d601c85/typescript-client";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {ReactNode} from "react";

const FEE_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Non payé",
  PAID: "Payé",
  LATE: "En retard",
  PENDING: "En cours de vérification",
};

const MOVEMENT_LABEL: Record<string, string> = {
  [CreditMovement.CREDIT]: "Crédit",
  [CreditMovement.DEBIT]: "Débit",
};

const ARCHIVE_STATUS_LABEL: Record<string, string> = {
  TO_ARCHIVE: "En attente d'archivage",
  ARCHIVED: "Archivé",
  REJECTED: "Rejeté",
};

const InfoRow = ({label, value}: {label: string; value: ReactNode}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: 2,
      py: 0.75,
    }}
  >
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    <Typography variant="body2">
      {value === undefined || value === null || value === ""
        ? EMPTY_TEXT
        : value}
    </Typography>
  </Box>
);

const SectionTitle = ({children}: {children: ReactNode}) => (
  <Typography
    variant="overline"
    sx={{fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em"}}
  >
    {children}
  </Typography>
);

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

        {fee && (
          <>
            <Divider sx={{my: 2}} />
            <SectionTitle>Frais concerné</SectionTitle>
            <InfoRow label="Référence du frais" value={fee.id} />
            <InfoRow
              label="Étudiant"
              value={[fee.student_ref, fee.student_first_name]
                .filter(Boolean)
                .join(" — ")}
            />
            <InfoRow
              label="Catégorie"
              value={
                CATEGORY.find((c) => c.value === fee.category)?.label ??
                fee.category
              }
            />
            <InfoRow
              label="Statut du frais"
              value={
                fee.status ? (FEE_STATUS_LABEL[fee.status] ?? fee.status) : null
              }
            />
            <InfoRow
              label="Reste à payer"
              value={
                fee.remaining_amount != null
                  ? renderMoney(fee.remaining_amount)
                  : null
              }
            />
            <InfoRow
              label="Échéance"
              value={fee.due_datetime ? formatDate(fee.due_datetime) : null}
            />
            <InfoRow
              label="Statut d'archivage"
              value={
                fee.archive_status
                  ? (ARCHIVE_STATUS_LABEL[fee.archive_status] ??
                    fee.archive_status)
                  : null
              }
            />
            <InfoRow
              label="Archivage traité par"
              value={[fee.archived_by_first_name, fee.archived_by_last_name]
                .filter(Boolean)
                .join(" ")}
            />
          </>
        )}
      </Box>
    </Dialog>
  );
};
