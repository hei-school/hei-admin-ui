import {renderMoney} from "@/operations/common/utils/money";
import {
  CATEGORY,
  FEE_STATUS,
  FEES_FREQUENCY,
  FEESTEMPLATES_CHOICES,
  PAYMENT_TYPE,
} from "@/operations/fees/constants";
import {PSP_COLORS, PSP_VALUES} from "@/operations/fees/utils";
import {PAYMENT_STATUS_LABEL} from "@/operations/payments/components/PaymentStatusIcon";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {
  ArchiveStatusEnum,
  CreditMovement,
  CreditTransaction,
} from "@haapi-3d601c85/typescript-client";
import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Archive,
  ArrowDownLeft,
  ArrowUpRight,
  LucideIcon,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import {ReactNode} from "react";

const FEE_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  FEESTEMPLATES_CHOICES.map((choice) => [choice.value, choice.label])
);

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORY.map((choice) => [choice.value, choice.label])
);

const FREQUENCY_LABEL: Record<string, string> = Object.fromEntries(
  FEES_FREQUENCY.map((choice) => [choice.value, choice.label])
);

const FEE_ARCHIVE_STATUS_LABEL: Record<ArchiveStatusEnum, string> = {
  [ArchiveStatusEnum.TO_ARCHIVE]: "En attente de validation",
  [ArchiveStatusEnum.ARCHIVED]: "Archivé",
  [ArchiveStatusEnum.REJECTED]: "Rejeté",
};

const MOVEMENT_META: Record<
  CreditMovement,
  {label: string; color: string; icon: LucideIcon}
> = {
  [CreditMovement.CREDIT]: {
    label: "Dépôt",
    color: "#10B981",
    icon: ArrowDownLeft,
  },
  [CreditMovement.DEBIT]: {
    label: "Retrait",
    color: "#EF4444",
    icon: ArrowUpRight,
  },
};

const FEE_SECTION_COLOR = "#F59E0B";
const PAYMENT_SECTION_COLOR = "#3B82F6";
const MANUAL_SECTION_COLOR = "#6B7280";

const InfoRow = ({label, value}: {label: string; value: ReactNode}) => (
  <Box sx={{display: "flex", justifyContent: "space-between", gap: 2, py: 0.4}}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500} textAlign="right">
      {value}
    </Typography>
  </Box>
);

const SectionHeader = ({
  icon: Icon,
  title,
  color,
}: {
  icon: LucideIcon;
  title: string;
  color: string;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      p: "0.5rem 0.75rem",
      mb: 1.5,
      borderRadius: "8px",
      background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.15)}`,
    }}
  >
    <Icon size={18} color={color} />
    <Typography variant="subtitle2" fontWeight="bold" sx={{color}}>
      {title}
    </Typography>
  </Box>
);

interface CreditTransactionDetailsDialogProps {
  transaction: CreditTransaction | null;
  onClose: () => void;
}

export const CreditTransactionDetailsDialog = ({
  transaction,
  onClose,
}: CreditTransactionDetailsDialogProps) => {
  if (!transaction) return null;

  const {fee, payment} = transaction;
  const lastMpbs = fee?.mpbs?.at(-1);

  const movement = MOVEMENT_META[transaction.movement ?? CreditMovement.CREDIT];

  const origin = payment
    ? {
        label: "Paiement d'un frais par crédit",
        icon: Wallet,
        color: PAYMENT_SECTION_COLOR,
      }
    : fee
      ? {
          label: "Archivage d'un frais",
          icon: Archive,
          color: FEE_SECTION_COLOR,
        }
      : {
          label: "Ajustement manuel",
          icon: Receipt,
          color: MANUAL_SECTION_COLOR,
        };
  const OriginIcon = origin.icon;

  return (
    <Dialog
      open={!!transaction}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{zIndex: 99999}}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Détails de la transaction
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{p: 0}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            p: "1.25rem 1.5rem",
            background: `linear-gradient(135deg, ${alpha(movement.color, 0.12)} 0%, ${alpha(movement.color, 0.04)} 100%)`,
            borderBottom: "1px solid",
            borderColor: alpha(movement.color, 0.15),
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: alpha(movement.color, 0.15),
              }}
            >
              <movement.icon color={movement.color} size={22} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {movement.label}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{color: movement.color, lineHeight: 1.2}}
              >
                {renderMoney(transaction.amount)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{textAlign: "right"}}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {formatDate(transaction.date_time)}
            </Typography>
            <Chip
              icon={<OriginIcon size={14} />}
              label={origin.label}
              size="small"
              sx={{
                mt: 0.5,
                fontWeight: 600,
                bgcolor: alpha(origin.color, 0.1),
                color: origin.color,
                border: `1px solid ${alpha(origin.color, 0.2)}`,
              }}
            />
          </Box>
        </Box>

        <Box sx={{p: "1.5rem"}}>
          {fee && (
            <Box sx={{mb: lastMpbs || payment ? 3 : 0}}>
              <SectionHeader
                icon={Archive}
                title="Frais rattaché"
                color={FEE_SECTION_COLOR}
              />
              <Grid container columnSpacing={3}>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Commentaire"
                    value={fee.comment || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Type"
                    value={(fee.type && FEE_TYPE_LABEL[fee.type]) || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Catégorie"
                    value={
                      (fee.category && CATEGORY_LABEL[fee.category]) ||
                      EMPTY_TEXT
                    }
                  />
                  <InfoRow
                    label="Fréquence"
                    value={
                      (fee.frequency && FREQUENCY_LABEL[fee.frequency]) ||
                      EMPTY_TEXT
                    }
                  />
                  <InfoRow
                    label="Statut du paiement"
                    value={(fee.status && FEE_STATUS[fee.status]) || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Montant total"
                    value={renderMoney(fee.total_amount)}
                  />
                  <InfoRow
                    label="Reste à payer"
                    value={renderMoney(fee.remaining_amount)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Date de création"
                    value={formatDate(fee.creation_datetime, false)}
                  />
                  <InfoRow
                    label="Date d'échéance"
                    value={formatDate(fee.due_datetime, false)}
                  />
                  <InfoRow
                    label="Dernière mise à jour"
                    value={formatDate(fee.updated_at)}
                  />
                  <InfoRow
                    label="Statut d'archivage"
                    value={
                      fee.archive_status ? (
                        <Chip
                          size="small"
                          label={FEE_ARCHIVE_STATUS_LABEL[fee.archive_status]}
                          sx={{
                            bgcolor: alpha(FEE_SECTION_COLOR, 0.1),
                            color: FEE_SECTION_COLOR,
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        "Non archivé"
                      )
                    }
                  />
                  <InfoRow
                    label="Archivé par"
                    value={fee.archived_by_ref || EMPTY_TEXT}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {lastMpbs && (
            <Box sx={{mb: payment ? 3 : 0}}>
              <SectionHeader
                icon={Receipt}
                title="Référence de transaction du frais"
                color={FEE_SECTION_COLOR}
              />
              <Grid container columnSpacing={3}>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Référence"
                    value={lastMpbs.psp_id || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Type"
                    value={
                      lastMpbs.psp_type ? (
                        <Chip
                          size="small"
                          color={PSP_COLORS[lastMpbs.psp_type]}
                          label={PSP_VALUES[lastMpbs.psp_type]}
                        />
                      ) : (
                        EMPTY_TEXT
                      )
                    }
                  />
                  <InfoRow
                    label="Ajout de la référence"
                    value={formatDate(lastMpbs.creation_datetime)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Dernière vérification par HEI"
                    value={formatDate(lastMpbs.last_datetime_verification)}
                  />
                  <InfoRow
                    label="Vérification par PSP"
                    value={formatDate(lastMpbs.psp_own_datetime_verification)}
                  />
                  <InfoRow
                    label="Vérification réussie"
                    value={formatDate(lastMpbs.successfully_verified_on)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {payment && (
            <Box>
              <SectionHeader
                icon={Wallet}
                title="Paiement rattaché"
                color={PAYMENT_SECTION_COLOR}
              />
              <Grid container columnSpacing={3}>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Montant"
                    value={renderMoney(payment.amount)}
                  />
                  <InfoRow
                    label="Type"
                    value={
                      (payment.type &&
                        (PAYMENT_TYPE as Record<string, string>)[
                          payment.type
                        ]) ||
                      EMPTY_TEXT
                    }
                  />
                  <InfoRow
                    label="Statut"
                    value={
                      (payment.status &&
                        PAYMENT_STATUS_LABEL[payment.status]) ||
                      EMPTY_TEXT
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoRow
                    label="Commentaire"
                    value={payment.comment || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Validé par"
                    value={payment.validated_by_ref || EMPTY_TEXT}
                  />
                  <InfoRow
                    label="Date de paiement"
                    value={formatDate(payment.creation_datetime)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {!fee && !payment && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{textAlign: "center", py: 2}}
            >
              Aucun frais ni paiement n'est rattaché à cette transaction.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};
