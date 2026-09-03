import {PALETTE_COLORS} from "@/haTheme";
import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client";
import {AccountBalance, FileDownload, Payments} from "@mui/icons-material";
import {Box, Chip, Typography} from "@mui/material";
import {RefreshCw} from "lucide-react";
import {ReactElement, useState} from "react";
import {FeesExport} from "../utils/FeesExport";
import {ColorDot} from "./ColorDot";
import {FEE_LEGEND_ITEMS} from "./FeeStatsColumns";
import {
  EXPORT_CHIP_SX,
  EXPORT_ICON_SX,
  getViewModeChipSx,
  ICON_COLOR,
  LEGEND_TEXT_SX,
  TABLE_HEADER_BOX_SX,
  TABLE_TITLE_SX,
  TOOLBAR_ICON_SX,
} from "./StyleFeeStat";

const TABLE_TITLE = "Transactions · Mobile Money";

const VIEW_MODE_OPTIONS: {
  value: AdvancedFeeStatisticsType;
  label: string;
  icon: ReactElement;
  testId: string;
}[] = [
  {
    value: AdvancedFeeStatisticsType.ACCOUNTING,
    label: "Comptable",
    icon: <AccountBalance sx={TOOLBAR_ICON_SX} />,
    testId: "viewmode-accounting",
  },
  {
    value: AdvancedFeeStatisticsType.RECEIPT,
    label: "Encaissement",
    icon: <Payments sx={TOOLBAR_ICON_SX} />,
    testId: "viewmode-receipt",
  },
];

type ViewModeProps = {
  viewMode: AdvancedFeeStatisticsType;
  onViewModeChange: (viewMode: AdvancedFeeStatisticsType) => void;
};

export const FeeStatsToolbar = ({
  viewMode,
  onViewModeChange,
}: ViewModeProps) => {
  const [isExportOpen, setExportOpen] = useState(false);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={1.5}
      sx={TABLE_HEADER_BOX_SX}
      flexWrap="wrap"
      gap={1}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <RefreshCw size={15} color={ICON_COLOR} />
        <Typography sx={TABLE_TITLE_SX}>{TABLE_TITLE}</Typography>
      </Box>

      <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
        <StatusLegend />
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
        <Chip
          icon={<FileDownload sx={EXPORT_ICON_SX} />}
          label="Exporter"
          size="small"
          onClick={() => setExportOpen(true)}
          sx={EXPORT_CHIP_SX}
        />
      </Box>

      <FeesExport open={isExportOpen} onClose={() => setExportOpen(false)} />
    </Box>
  );
};

const StatusLegend = () => (
  <Box display="flex" gap={1.5} alignItems="center" mr={0.5}>
    {FEE_LEGEND_ITEMS.map(({key, label, statusColors}) => (
      <Box key={key} display="flex" alignItems="center" gap={0.5}>
        <ColorDot color={statusColors.value} />
        <Typography sx={LEGEND_TEXT_SX}>{label}</Typography>
      </Box>
    ))}
  </Box>
);

const ViewModeToggle = ({viewMode, onViewModeChange}: ViewModeProps) => (
  <Box display="flex" gap={0.5}>
    {VIEW_MODE_OPTIONS.map(({value, label, icon, testId}) => (
      <Chip
        key={value}
        icon={icon}
        label={label}
        size="small"
        onClick={() => onViewModeChange(value)}
        data-testid={testId}
        sx={getViewModeChipSx(viewMode === value, PALETTE_COLORS.primary)}
      />
    ))}
  </Box>
);
