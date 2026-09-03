import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {FeeCounts, FeeRow} from "../types";
import {hasCount} from "../utils/FeeStatsRows";
import {ColorDot} from "./ColorDot";
import {
  FEE_COUNT_COLUMNS,
  FeeCountColumn,
  MISSING_COUNT_LABEL,
} from "./FeeStatsColumns";
import {FeeProgressCell} from "./FeeStatsProgress";
import {FeeStatsToolbar} from "./FeeStatsToolbar";
import {
  CELL_SX,
  DOT_COLOR_BY_CATEGORY,
  HEADER_CELL_SX,
  PROGRESS_LABEL_SX,
  PROGRESS_TOTAL_LABEL_SX,
  ROW_HOVER_SX,
  ROW_LABEL_SX,
  TABLE_CONTAINER_SX,
  TOTAL_LABEL_SX,
  TOTAL_ROW_SX,
} from "./StyleFeeStat";

const COUNT_WEIGHT = {row: 700, total: 800} as const;

type FeeStatsTableProps = {
  rows: readonly FeeRow[];
  totals: FeeCounts;
  viewMode: AdvancedFeeStatisticsType;
  onViewModeChange: (viewMode: AdvancedFeeStatisticsType) => void;
};

export const FeeStatsTable = ({
  rows,
  totals,
  viewMode,
  onViewModeChange,
}: FeeStatsTableProps) => (
  <Box sx={TABLE_CONTAINER_SX}>
    <FeeStatsToolbar viewMode={viewMode} onViewModeChange={onViewModeChange} />

    <Box sx={{overflowX: "auto"}}>
      <Table size="small">
        <FeeStatsTableHead />
        <TableBody>
          {rows.map((row) => (
            <FeeStatsTableRow key={row.label} row={row} />
          ))}
          <FeeStatsTotalRow totals={totals} />
        </TableBody>
      </Table>
    </Box>
  </Box>
);

const FeeStatsTableHead = () => (
  <TableHead>
    <TableRow>
      <TableCell sx={HEADER_CELL_SX}>TYPE</TableCell>
      {FEE_COUNT_COLUMNS.map((column) => (
        <TableCell key={column.key} sx={toHeaderCellSx(column)}>
          {column.label}
        </TableCell>
      ))}
      <TableCell sx={HEADER_CELL_SX} align="right">
        Quota payés / Total
      </TableCell>
    </TableRow>
  </TableHead>
);

const toHeaderCellSx = ({statusColors}: FeeCountColumn) =>
  statusColors
    ? [HEADER_CELL_SX, {color: statusColors.header}]
    : HEADER_CELL_SX;

const FeeStatsTableRow = ({row}: {row: FeeRow}) => (
  <TableRow sx={ROW_HOVER_SX}>
    <TableCell sx={CELL_SX}>
      <Box display="flex" alignItems="center" gap={0.8}>
        <ColorDot color={DOT_COLOR_BY_CATEGORY[row.category]} />
        <Typography sx={ROW_LABEL_SX}>{row.label}</Typography>
      </Box>
    </TableCell>
    {FEE_COUNT_COLUMNS.map((column) => (
      <FeeCountCell
        key={column.key}
        column={column}
        count={row[column.key]}
        fontWeight={COUNT_WEIGHT.row}
      />
    ))}
    <FeeProgressCell
      paid={row.paid}
      total={row.total}
      labelSx={PROGRESS_LABEL_SX}
    />
  </TableRow>
);

const FeeStatsTotalRow = ({totals}: {totals: FeeCounts}) => (
  <TableRow sx={TOTAL_ROW_SX}>
    <TableCell sx={TOTAL_LABEL_SX}>TOTAL</TableCell>
    {FEE_COUNT_COLUMNS.map((column) => (
      <FeeCountCell
        key={column.key}
        column={column}
        count={totals[column.key]}
        fontWeight={COUNT_WEIGHT.total}
      />
    ))}
    <FeeProgressCell
      paid={totals.paid}
      total={totals.total}
      labelSx={PROGRESS_TOTAL_LABEL_SX}
    />
  </TableRow>
);

type FeeCountCellProps = {
  column: FeeCountColumn;
  count: number;
  fontWeight: number;
};

const FeeCountCell = ({column, count, fontWeight}: FeeCountCellProps) => (
  <TableCell
    sx={[
      CELL_SX,
      {fontWeight},
      ...(column.statusColors ? [{color: column.statusColors.value}] : []),
    ]}
  >
    {hasCount(count) ? count : MISSING_COUNT_LABEL}
  </TableCell>
);
