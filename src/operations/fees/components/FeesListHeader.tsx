import {NOOP_ID} from "@/utils/constants";
import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client";
import {Box, Button, Typography} from "@mui/material";
import {Star} from "lucide-react";
import {useMemo, useState} from "react";
import {useGetOne, useListContext} from "react-admin";
import {FeeStats, FeeType, LevelType} from "../types";
import {DateRangePopover} from "../utils/DateRangePopover";
import {FilterChips} from "../utils/FeeFilterChips";
import {ImportDialog} from "../utils/FeeImportDialog";
import {buildRows, computeTotals} from "../utils/FeeStatsRows";
import {FeesStatsHeader} from "./FeeStatsHeader";
import {FeeStatsTable} from "./FeeStatsTable";
import {StatsStatus} from "./StatsStatus";
import {STATS_TITLE_SX, VERIFY_BUTTON_SX} from "./StyleFeeStat";

const DEFAULT_FEE_TYPE: FeeType = "MONTH";
const DEFAULT_LEVEL: LevelType = "ALL";

type FeesListHeaderProps = {
  title: string;
  isMpbs?: boolean;
};

export const FeesListHeader = ({
  title,
  isMpbs = false,
}: FeesListHeaderProps) => {
  const [viewMode, setViewMode] = useState<AdvancedFeeStatisticsType>(
    AdvancedFeeStatisticsType.ACCOUNTING
  );
  const [feeType, setFeeType] = useState<FeeType>(DEFAULT_FEE_TYPE);
  const [level, setLevel] = useState<LevelType>(DEFAULT_LEVEL);

  const stats = useFeeStats(viewMode);
  const rows = useMemo(
    () => buildRows(feeType, level, stats),
    [feeType, level, stats]
  );
  const totals = useMemo(() => computeTotals(rows), [rows]);

  return (
    <FeesStatsHeader
      title={<StatsTitle title={title} isMpbs={isMpbs} stats={stats} />}
      action={
        <Box display="flex" flexDirection="column" gap={1.5}>
          <FilterChips
            feeType={feeType}
            level={level}
            onFeeTypeChange={setFeeType}
            onLevelChange={setLevel}
          />
          <FeeStatsTable
            rows={rows}
            totals={totals}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>
      }
    />
  );
};

const useFeeStats = (
  viewMode: AdvancedFeeStatisticsType
): FeeStats | undefined => {
  const {filterValues} = useListContext();
  const filters = useMemo(
    () => ({...(filterValues ?? {}), viewMode}),
    [filterValues, viewMode]
  );

  const {data} = useGetOne<FeeStats>("stats", {
    id: NOOP_ID,
    meta: {resource: "fees_stats", filters},
  });

  return data;
};

type StatsTitleProps = {
  title: string;
  isMpbs: boolean;
  stats?: FeeStats;
};

const StatsTitle = ({title, isMpbs, stats}: StatsTitleProps) => (
  <Box
    display="flex"
    flexDirection={{xs: "column", sm: "row"}}
    alignItems={{xs: "flex-start", sm: "center"}}
    justifyContent="space-between"
    gap={1.5}
    width="100%"
  >
    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
      <Typography variant="h6" sx={STATS_TITLE_SX}>
        {title}
      </Typography>
      <DateRangePopover />
    </Box>
    {isMpbs ? <ImportTransactionsButton /> : <StatsStatus stats={stats} />}
  </Box>
);

const ImportTransactionsButton = () => {
  const [isImportOpen, setImportOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setImportOpen(true)}
        variant="outlined"
        size="small"
        startIcon={<Star size={13} />}
        sx={VERIFY_BUTTON_SX}
      >
        Vérifier les transactions
      </Button>
      <ImportDialog open={isImportOpen} onClose={() => setImportOpen(false)} />
    </>
  );
};
