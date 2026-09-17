import {renderMoney} from "@/operations/common/utils/money";
import {
  ARCHIVE_STATUS_LABEL,
  CATEGORY,
  FEE_STATUS_LABEL,
} from "@/operations/fees/constants";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {Fee} from "@haapi-b0fc7615/typescript-client";
import {Box, Divider, Typography} from "@mui/material";
import {ReactNode} from "react";

export const InfoRow = ({label, value}: {label: string; value: ReactNode}) => (
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

export const SectionTitle = ({children}: {children: ReactNode}) => (
  <Typography
    variant="overline"
    sx={{fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em"}}
  >
    {children}
  </Typography>
);

export const ReceiptList = ({children}: {children: ReactNode}) => (
  <Box sx={{display: "flex", flexDirection: "column", mt: 1}}>{children}</Box>
);

export const ReceiptRow = ({
  label,
  value,
  fullWidth = false,
  blankIfEmpty = false,
}: {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
  blankIfEmpty?: boolean;
}) => {
  const isEmpty = value === undefined || value === null || value === "";
  const display = isEmpty ? (blankIfEmpty ? "" : EMPTY_TEXT) : value;

  if (fullWidth) {
    return (
      <Box sx={{py: 0.5}}>
        <Typography variant="body2" color="text.secondary" component="span">
          {label}:{" "}
        </Typography>
        <Typography
          variant="body2"
          component="span"
          sx={{wordBreak: "break-word"}}
        >
          {display}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 0.5}}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{whiteSpace: "nowrap"}}
      >
        {label}
      </Typography>
      <Box
        sx={{
          flex: 1,
          borderBottom: "1px dotted",
          borderColor: "divider",
        }}
      />
      <Typography variant="body2" fontWeight={600} sx={{whiteSpace: "nowrap"}}>
        {display}
      </Typography>
    </Box>
  );
};

const dateOrBlank = (date: Date | string | undefined) =>
  date ? formatDate(date) : "";

export const FeeSummarySection = ({
  fee,
  hideDivider = false,
}: {
  fee: Fee;
  hideDivider?: boolean;
}) => {
  const isArchived = fee.archive_status === "ARCHIVED";
  const isRejected = fee.archive_status === "REJECTED";
  const archivedByName = [fee.archived_by_first_name, fee.archived_by_last_name]
    .filter(Boolean)
    .join(" ");
  const rejectedByName = [fee.rejected_by_first_name, fee.rejected_by_last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {!hideDivider && <Divider sx={{my: 2}} />}
      <SectionTitle>Frais concerné</SectionTitle>
      <ReceiptList>
        <ReceiptRow
          label="Catégorie"
          value={
            CATEGORY.find((c) => c.value === fee.category)?.label ??
            fee.category
          }
        />
        <ReceiptRow
          label="Statut du frais"
          value={
            fee.status ? (FEE_STATUS_LABEL[fee.status] ?? fee.status) : null
          }
        />
        <ReceiptRow
          label="Montant total"
          value={
            fee.total_amount != null ? renderMoney(fee.total_amount) : null
          }
        />
        <ReceiptRow
          label="Reste à payer"
          value={
            fee.remaining_amount != null
              ? renderMoney(fee.remaining_amount)
              : null
          }
        />
        <ReceiptRow
          label="Échéance"
          value={fee.due_datetime ? formatDate(fee.due_datetime) : null}
        />
        <ReceiptRow
          label="Statut d'archivage"
          value={
            fee.archive_status
              ? (ARCHIVE_STATUS_LABEL[fee.archive_status] ?? fee.archive_status)
              : null
          }
        />
        {fee.archive_status && (
          <ReceiptRow
            label="Demande d'archivage le"
            value={dateOrBlank(fee.archive_requested_datetime)}
            blankIfEmpty
          />
        )}
        {isArchived && (
          <>
            <ReceiptRow
              label="Archivé le"
              value={dateOrBlank(fee.archived_datetime)}
              blankIfEmpty
            />
            <ReceiptRow label="Archivé par" value={archivedByName} />
          </>
        )}
        {isRejected && (
          <>
            <ReceiptRow
              label="Rejeté le"
              value={dateOrBlank(fee.rejected_datetime)}
              blankIfEmpty
            />
            <ReceiptRow label="Rejeté par" value={rejectedByName} />
            <ReceiptRow label="Motif du rejet" value={fee.rejection_reason} />
          </>
        )}
      </ReceiptList>
    </>
  );
};
