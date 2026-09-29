import {NotificationsNoneOutlined} from "@mui/icons-material";
import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import {AlertCircle, Archive, MoveRight, Wallet} from "lucide-react";
import {useState} from "react";
import {Link, useGetList} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {useFeesToArchive} from "@/operations/fees/hooks/useFeesToArchive";
import {
  PaymentStatus,
  RetakeExamStatus,
} from "@haapi-b0fc7615/typescript-client";

const CREDIT_COLOR = "#10B981";
const ARCHIVE_COLOR = "#3B82F6";
const CANCELLATION_COLOR = "#F59E0B";

const NotificationBlock = ({
  icon,
  label,
  countLabel,
  color,
  to,
  onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  countLabel: string;
  color: string;
  to: string;
  onNavigate: () => void;
}) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: alpha(color, 0.2),
      borderRadius: "8px",
      bgcolor: alpha(color, 0.05),
      p: 1.5,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
        {icon}
        <Typography variant="body2" fontWeight="bold">
          {label}
        </Typography>
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          color,
          bgcolor: alpha(color, 0.12),
          border: "1px solid",
          borderColor: alpha(color, 0.25),
          borderRadius: "12px",
          px: 1,
          py: 0.25,
          whiteSpace: "nowrap",
        }}
      >
        {countLabel}
      </Box>
    </Box>
    <Box sx={{display: "flex", justifyContent: "center", mt: 1}}>
      <Link
        to={to}
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 13,
          fontWeight: 600,
          color,
          textDecoration: "none",
        }}
      >
        Voir
        <MoveRight size={14} />
      </Link>
    </Box>
  </Box>
);

export const PendingActionsNotifications = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const {toArchiveFees} = useFeesToArchive();
  const {data: pendingCreditPayments} = useGetList("credit-payments", {
    filter: {status: PaymentStatus.CREATED},
    pagination: {page: 1, perPage: 500},
  });
  const {data: pendingCancellations} = useGetList("retakeExams", {
    filter: {status: RetakeExamStatus.TO_CANCEL},
    pagination: {page: 1, perPage: 500},
  });

  const toArchiveCount = toArchiveFees.length;
  const pendingCreditCount = pendingCreditPayments?.length ?? 0;
  const pendingCancellationCount = pendingCancellations?.length ?? 0;
  const hasNotifications =
    toArchiveCount > 0 ||
    pendingCreditCount > 0 ||
    pendingCancellationCount > 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? "admin-notifications-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        data-testid="appbar-admin-notifications"
      >
        <Badge color="error" variant="dot" invisible={!hasNotifications}>
          <NotificationsNoneOutlined
            sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
          />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{padding: 2, minWidth: 300}}>
          <Typography fontWeight="bold" sx={{color: PALETTE_COLORS.yellow}}>
            Notifications
          </Typography>
          <Divider sx={{my: 1, bgcolor: PALETTE_COLORS.yellow}} />
          {!hasNotifications && (
            <Typography variant="body2" color="text.secondary">
              Aucune notification pour le moment.
            </Typography>
          )}
          <Stack spacing={1.5}>
            {pendingCreditCount > 0 && (
              <NotificationBlock
                icon={<Wallet size={18} color={CREDIT_COLOR} />}
                label="Paiements par crédit à valider"
                countLabel={`${pendingCreditCount} en attente`}
                color={CREDIT_COLOR}
                to="/credit-payments"
                onNavigate={handleClose}
              />
            )}
            {toArchiveCount > 0 && (
              <NotificationBlock
                icon={<Archive size={18} color={ARCHIVE_COLOR} />}
                label="Frais à archiver"
                countLabel={`${toArchiveCount} à archiver`}
                color={ARCHIVE_COLOR}
                to="/fees-to-archive"
                onNavigate={handleClose}
              />
            )}
            {pendingCancellationCount > 0 && (
              <NotificationBlock
                icon={<AlertCircle size={18} color={CANCELLATION_COLOR} />}
                label="Demandes d'annulation de rattrapage"
                countLabel={`${pendingCancellationCount} en attente`}
                color={CANCELLATION_COLOR}
                to="/retake-exams/cancellation"
                onNavigate={handleClose}
              />
            )}
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};
