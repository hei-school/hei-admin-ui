import {formatDate} from "@/utils/date";
import {Box} from "@mui/material";
import {keyframes, styled} from "@mui/material/styles";
import {
  AlertTriangle,
  CalendarClock,
  CircleCheckBig,
  RefreshCw,
} from "lucide-react";
import {FC} from "react";
import {FeeStats} from "../types";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface StatusTheme {
  main: string;
  border: string;
  bgStart: string;
  bgEnd: string;
  shadow: string;
  timestampBg: string;
  timestampText: string;
}

const THEMES: Record<string, StatusTheme> = {
  ok: {
    main: "#16C60C",
    border: "#16C60C",
    bgStart: "#B6FFB6",
    bgEnd: "#5CFF5C",
    shadow: "rgba(22, 198, 12, 0.25)",
    timestampBg: "#E6FFE6",
    timestampText: "#16C60C",
  },
  loading: {
    main: "#0078D4",
    border: "#0078D4",
    bgStart: "#B3E0FF",
    bgEnd: "#4FC3F7",
    shadow: "rgba(0, 120, 212, 0.25)",
    timestampBg: "#E3F2FD",
    timestampText: "#0078D4",
  },
  warning: {
    main: "#FFB900",
    border: "#FFB900",
    bgStart: "#FFF3CD",
    bgEnd: "#FFD966",
    shadow: "rgba(255, 185, 0, 0.25)",
    timestampBg: "#FFF8E1",
    timestampText: "#FFB900",
  },
};

const SpinningRefreshCw = styled(RefreshCw)`
  animation: ${spin} 2s linear infinite;
`;

const StatusContainer = styled(Box)<{statusTheme: StatusTheme}>(
  ({statusTheme}) => ({
    "display": "inline-flex",
    "flexDirection": "column",
    "height": "fit-content",
    "borderRadius": "10px",
    "border": `1px solid ${statusTheme.border}`,
    "background": `linear-gradient(135deg, ${statusTheme.bgStart} 0%, ${statusTheme.bgEnd} 100%)`,
    "boxShadow": `0 8px 32px 0 ${statusTheme.shadow}`,
    "backdropFilter": "blur(10px)",
    "transition": "all 0.3s ease-in-out",
    "overflow": "hidden",
    "&:hover": {
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: `0 12px 40px 0 ${statusTheme.shadow}`,
    },
  })
);

const MainStatus = styled(Box)<{statusTheme: StatusTheme}>(({statusTheme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "12px 16px",
  color: statusTheme.main,
  fontWeight: "bold",
  fontSize: "1rem",
}));

const Timestamp = styled(Box)<{statusTheme: StatusTheme}>(({statusTheme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  backgroundColor: statusTheme.timestampBg,
  color: statusTheme.timestampText,
  fontSize: "0.75rem",
  animation: `${fadeIn} 0.8s ease-out`,
}));

export const StatsStatus: FC<{stats?: FeeStats}> = ({stats}) => {
  if (stats === undefined) {
    return null;
  }

  const {
    expired,
    update_datetime,
    total_expected_fees_count,
    paid_fees_count,
    pending_fees_count,
    late_fees_count,
  } = stats;

  const areCountsNull =
    total_expected_fees_count === null &&
    paid_fees_count === null &&
    pending_fees_count === null &&
    late_fees_count === null;

  let message, Icon, theme;

  if (expired === false) {
    message = "Statistiques à jour";
    Icon = CircleCheckBig;
    theme = THEMES.ok;
  } else if (expired === true) {
    if (areCountsNull) {
      message = "Génération en cours...";
      Icon = SpinningRefreshCw;
      theme = THEMES.loading;
    } else {
      message = "Statistiques anciennes";
      Icon = AlertTriangle;
      theme = THEMES.warning;
    }
  } else {
    return null;
  }

  return (
    <StatusContainer statusTheme={theme}>
      <MainStatus statusTheme={theme}>
        <Icon size={18} />
        <span>{message}</span>
      </MainStatus>
      {update_datetime && (
        <Timestamp statusTheme={theme}>
          <CalendarClock size={14} />
          <span>{`Dernière MAJ: ${formatDate(update_datetime, true)}`}</span>
        </Timestamp>
      )}
    </StatusContainer>
  );
};
