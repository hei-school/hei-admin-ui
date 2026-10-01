import {PALETTE_COLORS} from "@/haTheme";
import {Sms as SmsIcon} from "@mui/icons-material";
import {Chip, Skeleton, Tooltip} from "@mui/material";
import {Link} from "react-admin";
import {useSmsBalance} from "./useSmsBalance";

export const SmsBalanceIndicator = () => {
  const {balance, isLoading, hasError} = useSmsBalance();

  if (isLoading) {
    return <Skeleton variant="rounded" width={90} height={32} />;
  }

  if (hasError || balance === null) {
    return null;
  }

  return (
    <Tooltip title="Solde SMS disponible (BEFIANA)">
      <Chip
        data-testid="sms-balance-indicator"
        component={Link}
        to="/sms-campaigns"
        clickable
        icon={<SmsIcon sx={{color: `${PALETTE_COLORS.primary} !important`}} />}
        label={`${balance} SMS`}
        size="small"
        variant="outlined"
        sx={{fontWeight: 600, borderColor: PALETTE_COLORS.primary}}
      />
    </Tooltip>
  );
};
