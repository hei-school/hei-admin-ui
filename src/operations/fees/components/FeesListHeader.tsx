import {NOOP_ID} from "@/utils/constants";
import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client";
import {Box, Button, Typography} from "@mui/material";
import {Star} from "lucide-react";
import {FC, useMemo, useState} from "react";
import {useGetOne, useListContext} from "react-admin";
import {FeeStats, FeeType, LevelType} from "../types";
import {DateRangePopover} from "../utils/DateRangePopover";
import {FilterChips} from "../utils/FeeFilterChips";
import {ImportDialog} from "../utils/FeeImportDialog";
import {buildRows, computeTotals} from "../utils/FeeStatsUtils";
import {FeesStatsHeader} from "./FeeStatsHeader";
import {FeeStatsTable} from "./FeeStatsTable";
import {StatsStatus} from "./StatsStatus";
import {VERIFY_BUTTON_SX} from "./StyleFeeStat";

type Props = {
  title: string;
  isMpbs: boolean;
};

export const FeesListHeader: FC<Props> = ({title, isMpbs = false}) => {
  const {filterValues} = useListContext();
  const [viewMode, setViewMode] =
    useState<AdvancedFeeStatisticsType>("ACCOUNTING");
  const [feeType, setFeeType] = useState<FeeType>("MONTH");
  const [level, setLevel] = useState<LevelType>("ALL");
  const [importOpen, setImportOpen] = useState(false);

  const mergedFilters = useMemo(
    () => ({...(filterValues || {}), viewMode}),
    [filterValues, viewMode]
  );

  const {data: stats} = useGetOne<FeeStats>("stats", {
    id: NOOP_ID,
    meta: {resource: "fees_stats", filters: mergedFilters},
  });

  const rows = useMemo(
    () => buildRows(feeType, level, stats),
    [feeType, level, stats]
  );

  const totals = useMemo(() => computeTotals(rows), [rows]);

  return (
    <FeesStatsHeader
      cardContents={[]}
      title={
        <Box display="flex" flexDirection="column" gap={1} width="100%">
          <Box
            display="flex"
            flexDirection={{xs: "column", sm: "row"}}
            alignItems={{xs: "flex-start", sm: "center"}}
            justifyContent="space-between"
            gap={1.5}
            width="100%"
          >
            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
              <Typography
                variant="h6"
                fontWeight="800"
                fontSize={{xs: "1.1rem", sm: "1.3rem"}}
                sx={{color: "#1a1a1a", letterSpacing: "-0.01em"}}
              >
                {title}
              </Typography>
              <DateRangePopover />
            </Box>
            {isMpbs && (
              <Button
                onClick={() => setImportOpen(true)}
                variant="outlined"
                size="small"
                startIcon={<Star size={13} />}
                sx={VERIFY_BUTTON_SX}
              >
                Vérifier les transactions
              </Button>
            )}
            {!isMpbs && <StatsStatus stats={stats} />}
          </Box>
          <ImportDialog
            open={importOpen}
            onClose={() => setImportOpen(false)}
          />
        </Box>
      }
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
