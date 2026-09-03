import {formatDate} from "@/utils/date";
import {Box} from "@mui/material";
import {keyframes, styled} from "@mui/material/styles";
import {
  AlertTriangle,
  CalendarClock,
  CircleCheckBig,
  RefreshCw,
} from "lucide-react";
import {ElementType} from "react";
import {FeeStats} from "../types";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

type StatusTheme = {
  main: string;
  border: string;
  bgStart: string;
  bgEnd: string;
  shadow: string;
  timestampBg: string;
  timestampText: string;
};

const THEMES: Record<"ok" | "loading" | "warning", StatusTheme> = {
  ok: {
    main: "#16C60C",
    border: "#16C60C",
    bgStart: "#B6FFB6",
    bgEnd: "#5CFF5C",
    shadow: "rgba(22, 198, 12, 0.2)",
    timestampBg: "#E6FFE6",
    timestampText: "#16C60C",
  },
  loading: {
    main: "#0078D4",
    border: "#0078D4",
    bgStart: "#B3E0FF",
    bgEnd: "#4FC3F7",
    shadow: "rgba(0, 120, 212, 0.2)",
    timestampBg: "#E3F2FD",
    timestampText: "#0078D4",
  },
  warning: {
    main: "#FFB900",
    border: "#FFB900",
    bgStart: "#FFF3CD",
    bgEnd: "#FFD966",
    shadow: "rgba(255, 185, 0, 0.2)",
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
    "alignItems": "center",
    "flexDirection": "row",
    "borderRadius": "20px",
    "border": `1px solid ${statusTheme.border}`,
    "background": `linear-gradient(135deg, ${statusTheme.bgStart} 0%, ${statusTheme.bgEnd} 100%)`,
    "boxShadow": `0 4px 12px 0 ${statusTheme.shadow}`,
    "overflow": "hidden",
    "transition": "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 18px 0 ${statusTheme.shadow}`,
    },
  })
);

const MainStatus = styled(Box)<{statusTheme: StatusTheme}>(({statusTheme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 10px",
  color: statusTheme.main,
  fontWeight: 700,
  fontSize: "0.78rem",
}));

const Timestamp = styled(Box)<{statusTheme: StatusTheme}>(({statusTheme}) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  borderLeft: `1px solid ${statusTheme.border}`,
  backgroundColor: statusTheme.timestampBg,
  color: statusTheme.timestampText,
  fontSize: "0.72rem",
  animation: `${fadeIn} 0.6s ease-out`,
}));

export const StatsStatus = ({stats}: {stats?: FeeStats}) => {
  const status = stats ? resolveStatus(stats) : undefined;
  if (!status) return null;

  const {message, Icon, theme} = status;

  return (
    <StatusContainer statusTheme={theme}>
      <MainStatus statusTheme={theme}>
        <Icon size={13} />
        <span>{message}</span>
      </MainStatus>
      {stats?.update_datetime && (
        <Timestamp statusTheme={theme}>
          <CalendarClock size={11} />
          <span>{`MAJ: ${formatDate(stats.update_datetime, true)}`}</span>
        </Timestamp>
      )}
    </StatusContainer>
  );
};

type ResolvedStatus = {message: string; Icon: ElementType; theme: StatusTheme};

const resolveStatus = (stats: FeeStats): ResolvedStatus | undefined => {
  if (stats.expired === false)
    return {message: "À jour", Icon: CircleCheckBig, theme: THEMES.ok};

  if (stats.expired !== true) return undefined;

  return isGenerating(stats)
    ? {message: "Génération...", Icon: SpinningRefreshCw, theme: THEMES.loading}
    : {message: "Anciennes stats", Icon: AlertTriangle, theme: THEMES.warning};
};

const isGenerating = (stats: FeeStats): boolean =>
  [
    stats.total_expected_fees_count,
    stats.paid_fees_count,
    stats.pending_fees_count,
    stats.late_fees_count,
  ].every((counts) => counts === null);
