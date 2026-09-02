import {renderMoney} from "@/operations/common/utils/money";
import {CATEGORY, PAYMENT_TYPE} from "@/operations/fees/constants";
import {
  PAYMENT_STATUS_ICON,
  PAYMENT_STATUS_LABEL,
} from "@/operations/payments/components/PaymentStatusIcon";
import {Dialog} from "@/ui/components";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {CreditPayment, PaymentStatus} from "@haapi-3d601c85/typescript-client";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {ReactNode} from "react";

const FEE_STATUS_LABEL: Record<string, string> = {
  UNPAID: "Non payé",
  PAID: "Payé",
  LATE: "En retard",
  PENDING: "En cours de vérification",
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
              label="Montant total"
              value={
                fee.total_amount != null ? renderMoney(fee.total_amount) : null
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
            <InfoRow label="Commentaire du frais" value={fee.comment} />
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
