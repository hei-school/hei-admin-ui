import {Box, Chip, Typography} from "@mui/material";
import {CalendarDays, RefreshCw} from "lucide-react";
import {ReactElement, ReactNode} from "react";
import {
  FILTER_LABEL_SX,
  getChipSx,
  getLevelChipSx,
  SEPARATOR_SX,
} from "../components/StyleFeeStat";
import {FeeType, LevelType} from "../types";

const FEE_TYPE_OPTIONS: {
  value: FeeType;
  label: string;
  icon?: ReactElement;
}[] = [
  {value: "ALL", label: "Tout"},
  {value: "MONTH", label: "Mensuel", icon: <RefreshCw size={11} />},
  {value: "YEAR", label: "Annuel", icon: <CalendarDays size={11} />},
  {value: "RATTRAPAGE", label: "Rattrapages"},
  {value: "FRAIS_GENERAUX", label: "Frais généraux"},
  {value: "ALTERNANT", label: "Alternants"},
];

const LEVEL_OPTIONS: {value: LevelType; label: string}[] = [
  {value: "ALL", label: "Tous"},
  {value: "L1", label: "L1"},
  {value: "L2", label: "L2"},
  {value: "L3", label: "L3"},
];

const FEE_TYPES_WITHOUT_LEVEL: readonly FeeType[] = ["ALTERNANT"];

type FilterChipsProps = {
  feeType: FeeType;
  level: LevelType;
  onFeeTypeChange: (feeType: FeeType) => void;
  onLevelChange: (level: LevelType) => void;
};

export const FilterChips = ({
  feeType,
  level,
  onFeeTypeChange,
  onLevelChange,
}: FilterChipsProps) => {
  const isLevelDisabled = FEE_TYPES_WITHOUT_LEVEL.includes(feeType);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
      <FilterGroup label="Frais">
        {FEE_TYPE_OPTIONS.map(({value, label, icon}) => (
          <Chip
            key={value}
            icon={icon}
            label={label}
            size="small"
            onClick={() => onFeeTypeChange(value)}
            sx={getChipSx(feeType === value)}
          />
        ))}
      </FilterGroup>

      <Box sx={SEPARATOR_SX} />

      <FilterGroup label="Niveau">
        {LEVEL_OPTIONS.map(({value, label}) => (
          <Chip
            key={value}
            label={label}
            size="small"
            disabled={isLevelDisabled}
            onClick={() => !isLevelDisabled && onLevelChange(value)}
            sx={getLevelChipSx(level === value, isLevelDisabled)}
          />
        ))}
      </FilterGroup>
    </Box>
  );
};

const FilterGroup = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Typography sx={FILTER_LABEL_SX}>{label}</Typography>
    <Box display="flex" gap={0.5}>
      {children}
    </Box>
  </Box>
);
