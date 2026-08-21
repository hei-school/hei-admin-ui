import {PALETTE_COLORS} from "@/haTheme";
import {AdvancedFeeStatisticsType} from "@haapi-3d601c85/typescript-client";
import {AccountBalance, FileDownload, Payments} from "@mui/icons-material";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {RefreshCw} from "lucide-react";
import {FC, useState} from "react";
import {FeeRow, RowTotals} from "../types";
import {FeesExport} from "../utils/FeesExport";
import {getBarColor} from "../utils/FeeStatsUtils";
import {
  CELL_SX,
  EXPORT_CHIP_SX,
  getViewModeChipSx,
  HEADER_CELL_SX,
  LEGEND_TEXT_SX,
  PROGRESS_EMPTY_SX,
  PROGRESS_TRACK_SX,
  TABLE_CONTAINER_SX,
  TABLE_HEADER_BOX_SX,
  TABLE_TITLE_SX,
  TOTAL_LABEL_SX,
  TOTAL_ROW_SX,
} from "./StyleFeeStat";
import {useFeeStatistics} from "./useFeeStatistics";

const LEGEND_ITEMS = [
  {color: "#e07b7b", label: "Non payés"},
  {color: "#6fcf97", label: "Payés"},
  {color: "#56CCF2", label: "En cours"},
  {color: "#f1C16B", label: "En retard"},
];

const ProgressCell: FC<{paid: number; total: number}> = ({paid, total}) => {
  const invalid = isNaN(paid) || isNaN(total) || total === 0;
  const pct = invalid ? 0 : (paid / total) * 100;
  const color = getBarColor(pct);

  return (
    <TableCell sx={{...CELL_SX, py: 1.5, minWidth: 160}} align="right">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        gap={0.6}
      >
        {invalid ? (
          <>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.25)",
                fontWeight: 600,
                fontSize: "0.95rem",
                lineHeight: 1,
              }}
            >
              —
            </Typography>
            <Box sx={PROGRESS_EMPTY_SX} />
          </>
        ) : (
          <>
            <Typography
              sx={{color, fontWeight: 800, fontSize: "1rem", lineHeight: 1}}
            >
              {paid} / {total}
            </Typography>
            <Box sx={PROGRESS_TRACK_SX}>
              <Box
                sx={{
                  width: `${pct}%`,
                  height: "100%",
                  bgcolor: color,
                  borderRadius: 2,
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </TableCell>
  );
};

const ViewModeToggle: FC<{
  viewMode: AdvancedFeeStatisticsType;
  onViewModeChange: (mode: AdvancedFeeStatisticsType) => void;
}> = ({viewMode, onViewModeChange}) => (
  <Box display="flex" gap={0.5}>
    <Chip
      icon={<AccountBalance sx={{fontSize: "1rem !important"}} />}
      label="Comptable"
      size="small"
      onClick={() => onViewModeChange("ACCOUNTING")}
      data-testid="viewmode-accounting"
      sx={getViewModeChipSx(viewMode === "ACCOUNTING", PALETTE_COLORS.primary)}
    />
    <Chip
      icon={<Payments sx={{fontSize: "1rem !important"}} />}
      label="Encaissement"
      size="small"
      onClick={() => onViewModeChange("RECEIPT")}
      data-testid="viewmode-receipt"
      sx={getViewModeChipSx(viewMode === "RECEIPT", PALETTE_COLORS.primary)}
    />
  </Box>
);

type Props = {
  rows: FeeRow[];
  totals: RowTotals;
  viewMode: AdvancedFeeStatisticsType;
  onViewModeChange: (mode: AdvancedFeeStatisticsType) => void;
  statsStatus?: React.ReactNode;
};

export const FeeStatsTable: FC<Props> = ({
  rows,
  totals,
  viewMode,
  onViewModeChange,
  statsStatus,
}) => {
  const {openStatistics} = useFeeStatistics();
  const [exportOpen, setExportOpen] = useState(false);

  const totalPct = totals.total > 0 ? (totals.paid / totals.total) * 100 : 0;
  const totalBarColor = getBarColor(totalPct);

  return (
    <Box sx={TABLE_CONTAINER_SX}>
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
          <RefreshCw size={15} color="rgba(255,255,255,0.8)" />
          <Typography sx={TABLE_TITLE_SX}>
            Transactions · Mobile Money
          </Typography>
          {statsStatus && <Box ml={1}>{statsStatus}</Box>}
        </Box>

        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Box display="flex" gap={1.5} alignItems="center" mr={0.5}>
            {LEGEND_ITEMS.map(({color, label}) => (
              <Box key={label} display="flex" alignItems="center" gap={0.5}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={LEGEND_TEXT_SX}>{label}</Typography>
              </Box>
            ))}
          </Box>

          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />

          <Chip
            icon={<FileDownload sx={{fontSize: "0.95rem !important"}} />}
            label="Exporter"
            size="small"
            onClick={() => setExportOpen(true)}
            sx={EXPORT_CHIP_SX}
          />
        </Box>
      </Box>

      <FeesExport open={exportOpen} onClose={() => setExportOpen(false)} />

      <Box sx={{overflowX: "auto"}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={HEADER_CELL_SX}>TYPE</TableCell>
              <TableCell sx={{...HEADER_CELL_SX, color: "#e88080"}}>
                Non payés
              </TableCell>
              <TableCell sx={{...HEADER_CELL_SX, color: "#7de0a0"}}>
                Payés
              </TableCell>
              <TableCell sx={{...HEADER_CELL_SX, color: "#6dd8f5"}}>
                En cours
              </TableCell>
              <TableCell sx={{...HEADER_CELL_SX, color: "#f5cc7a"}}>
                Retard
              </TableCell>
              <TableCell sx={HEADER_CELL_SX}>Total</TableCell>
              <TableCell sx={HEADER_CELL_SX} align="right">
                Quota payés / Total
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const dotColor =
                row.dotColor ?? (row.type === "MONTH" ? "#56CCF2" : "#f1C16B");

              return (
                <TableRow
                  key={row.label}
                  sx={{"&:hover": {bgcolor: "rgba(255,255,255,0.04)"}}}
                >
                  <TableCell sx={CELL_SX}>
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          "color": "#fff",
                          "fontWeight": 600,
                          "fontSize": "0.95rem",
                          "cursor": "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "#f1C16B",
                          },
                        }}
                        onClick={() => openStatistics(row.label, row.type)}
                      >
                        {row.label}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{...CELL_SX, color: "#e07b7b", fontWeight: 700}}
                  >
                    {isNaN(row.unpaid) ? "—" : row.unpaid}
                  </TableCell>
                  <TableCell
                    sx={{...CELL_SX, color: "#6fcf97", fontWeight: 700}}
                  >
                    {isNaN(row.paid) ? "—" : row.paid}
                  </TableCell>
                  <TableCell
                    sx={{...CELL_SX, color: "#56CCF2", fontWeight: 700}}
                  >
                    {isNaN(row.pending) ? "—" : row.pending}
                  </TableCell>
                  <TableCell
                    sx={{...CELL_SX, color: "#f1C16B", fontWeight: 700}}
                  >
                    {isNaN(row.late) ? "—" : row.late}
                  </TableCell>
                  <TableCell sx={{...CELL_SX, fontWeight: 700}}>
                    {isNaN(row.total) ? "—" : row.total}
                  </TableCell>
                  <ProgressCell paid={row.paid} total={row.total} />
                </TableRow>
              );
            })}

            <TableRow sx={TOTAL_ROW_SX}>
              <TableCell sx={TOTAL_LABEL_SX}>TOTAL</TableCell>
              <TableCell sx={{...CELL_SX, color: "#e07b7b", fontWeight: 800}}>
                {totals.unpaid}
              </TableCell>
              <TableCell sx={{...CELL_SX, color: "#6fcf97", fontWeight: 800}}>
                {totals.paid}
              </TableCell>
              <TableCell sx={{...CELL_SX, color: "#56CCF2", fontWeight: 800}}>
                {totals.pending}
              </TableCell>
              <TableCell sx={{...CELL_SX, color: "#f1C16B", fontWeight: 800}}>
                {totals.late}
              </TableCell>
              <TableCell sx={{...CELL_SX, fontWeight: 800}}>
                {totals.total}
              </TableCell>
              <TableCell
                sx={{...CELL_SX, py: 1.5, minWidth: 160}}
                align="right"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                  gap={0.6}
                >
                  <Typography
                    sx={{
                      color: totalBarColor,
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      lineHeight: 1,
                    }}
                  >
                    {totals.total > 0
                      ? `${totals.paid} / ${totals.total}`
                      : "—"}
                  </Typography>
                  <Box sx={PROGRESS_TRACK_SX}>
                    <Box
                      sx={{
                        width: `${totalPct}%`,
                        height: "100%",
                        bgcolor: totalBarColor,
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
