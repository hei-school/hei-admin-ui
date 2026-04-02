import {Box, Chip, Typography} from "@mui/material";
import {CalendarDays, RefreshCw} from "lucide-react";
import {FC, ReactElement} from "react";
import {
  FILTER_LABEL_SX,
  getChipSx,
  getLevelChipSx,
  SEPARATOR_SX,
} from "../components/StyleFeeStat";
import {FeeType, LevelType} from "../types";

type FeeTypeOption = {
  value: FeeType;
  label: string;
  icon?: ReactElement;
};

const FEE_TYPE_OPTIONS: FeeTypeOption[] = [
  {value: "ALL", label: "Tout"},
  {value: "MONTH", label: "Mensuel", icon: <RefreshCw size={11} />},
  {value: "YEAR", label: "Annuel", icon: <CalendarDays size={11} />},
  {value: "RATTRAPAGE", label: "Rattrapages"},
  {value: "ALTERNANT", label: "Alternants"},
] as const;

const LEVEL_OPTIONS: {value: LevelType; label: string}[] = [
  {value: "ALL", label: "Tous"},
  {value: "L1", label: "L1"},
  {value: "L2", label: "L2"},
  {value: "L3", label: "L3"},
] as const;

type Props = {
  feeType: FeeType;
  level: LevelType;
  onFeeTypeChange: (ft: FeeType) => void;
  onLevelChange: (l: LevelType) => void;
};

export const FilterChips: FC<Props> = ({
  feeType,
  level,
  onFeeTypeChange,
  onLevelChange,
}) => {
  const levelDisabled = feeType === "ALTERNANT";

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography sx={FILTER_LABEL_SX}>Frais</Typography>
        <Box display="flex" gap={0.5}>
          {FEE_TYPE_OPTIONS.map(({value, label, icon}) => (
            <Chip
              key={value}
              icon={icon ?? undefined}
              label={label}
              size="small"
              onClick={() => onFeeTypeChange(value)}
              sx={getChipSx(feeType === value)}
            />
          ))}
        </Box>
      </Box>

      <Box sx={SEPARATOR_SX} />

      <Box display="flex" alignItems="center" gap={1}>
        <Typography sx={FILTER_LABEL_SX}>Niveau</Typography>
        <Box display="flex" gap={0.5}>
          {LEVEL_OPTIONS.map(({value, label}) => {
            const active = level === value;
            return (
              <Chip
                key={value}
                label={label}
                size="small"
                disabled={levelDisabled}
                onClick={() => !levelDisabled && onLevelChange(value)}
                sx={getLevelChipSx(active, levelDisabled)}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
