import {Box, TableCell, Theme, Typography} from "@mui/material";
import {SystemStyleObject} from "@mui/system";
import {hasCount, toPaidRatio} from "../utils/FeeStatsRows";
import {CountSkeleton} from "./CountSkeleton";
import {
  getBarColor,
  MISSING_COUNT_SX,
  PROGRESS_CELL_SX,
  PROGRESS_EMPTY_SX,
  PROGRESS_TRACK_SX,
} from "./StyleFeeStat";

const QUOTA_SKELETON_WIDTH = 46;

type ProgressContentProps = {
  paid: number;
  total: number;
  labelSx: SystemStyleObject<Theme>;
};

type FeeProgressCellProps = ProgressContentProps & {isUpdating: boolean};

export const FeeProgressCell = ({
  paid,
  total,
  labelSx,
  isUpdating,
}: FeeProgressCellProps) => (
  <TableCell sx={PROGRESS_CELL_SX} align="right">
    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.6}>
      {isUpdating ? (
        <UpdatingProgress />
      ) : (
        <ProgressContent paid={paid} total={total} labelSx={labelSx} />
      )}
    </Box>
  </TableCell>
);

const UpdatingProgress = () => (
  <>
    <CountSkeleton width={QUOTA_SKELETON_WIDTH} />
    <Box sx={PROGRESS_EMPTY_SX} />
  </>
);

const ProgressContent = ({paid, total, labelSx}: ProgressContentProps) =>
  isMeasurable(paid, total) ? (
    <MeasuredProgress paid={paid} total={total} labelSx={labelSx} />
  ) : (
    <MissingProgress />
  );

const isMeasurable = (paid: number, total: number): boolean =>
  hasCount(paid) && hasCount(total) && total > 0;

const MeasuredProgress = ({paid, total, labelSx}: ProgressContentProps) => {
  const paidRatio = toPaidRatio(paid, total);
  const barColor = getBarColor(paidRatio);

  return (
    <>
      <Typography sx={[labelSx, {color: barColor}]}>
        {paid} / {total}
      </Typography>
      <Box sx={PROGRESS_TRACK_SX}>
        <Box
          sx={{
            width: `${paidRatio}%`,
            height: "100%",
            bgcolor: barColor,
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </Box>
    </>
  );
};

const MissingProgress = () => (
  <>
    <Typography sx={MISSING_COUNT_SX}>—</Typography>
    <Box sx={PROGRESS_EMPTY_SX} />
  </>
);
