import {PALETTE_COLORS} from "@/haTheme";
import {formatDate} from "@/utils/date";
import {Button, Chip, Popover, TextField, Typography} from "@mui/material";
import {CalendarDays} from "lucide-react";
import {MouseEvent, useState} from "react";
import {useListContext} from "react-admin";
import {
  APPLY_BUTTON_SX,
  DATE_CHIP_SX,
  DATE_POPOVER_PAPER_SX,
} from "../components/StyleFeeStat";
import {
  buildDateRange,
  getMonthRangeError,
  MonthRangeError,
  toCurrentMonthInput,
  toMonthInput,
} from "./FeeDateRange";

const RANGE_ERROR_MESSAGE: Record<MonthRangeError, string> = {
  INCOMPLETE: "",
  REVERSED: "Le mois de fin doit suivre le mois de début.",
  IN_FUTURE: "Le mois de fin ne peut pas dépasser le mois en cours.",
};

export const DateRangePopover = () => {
  const {filterValues, setFilters} = useListContext();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [monthFromInput, setMonthFromInput] = useState("");
  const [monthToInput, setMonthToInput] = useState("");

  const currentMonth = toCurrentMonthInput();
  const rangeError = getMonthRangeError(monthFromInput, monthToInput);

  const openPopover = (event: MouseEvent<HTMLElement>) => {
    setMonthFromInput(toMonthInput(filterValues?.monthFrom));
    setMonthToInput(toMonthInput(filterValues?.monthTo));
    setAnchor(event.currentTarget);
  };

  const closePopover = () => setAnchor(null);

  const applyDateRange = () => {
    if (rangeError) return;
    const dateRange = buildDateRange(monthFromInput, monthToInput);
    setFilters({...filterValues, ...dateRange}, {});
    closePopover();
  };

  const hasFilteredRange = Boolean(
    filterValues?.monthFrom && filterValues?.monthTo
  );
  if (!hasFilteredRange) return null;

  return (
    <>
      <Chip
        icon={<CalendarDays size={13} />}
        label={
          <span>
            <strong>{formatDate(filterValues.monthFrom, false)}</strong>
            {" → "}
            <strong>{formatDate(filterValues.monthTo, false)}</strong>
          </span>
        }
        size="small"
        onClick={openPopover}
        sx={DATE_CHIP_SX}
      />

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closePopover}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        transformOrigin={{vertical: "top", horizontal: "left"}}
        slotProps={{paper: {sx: DATE_POPOVER_PAPER_SX}}}
      >
        <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary">
          Modifier la période
        </Typography>

        <MonthInput
          label="Du"
          value={monthFromInput}
          onChange={setMonthFromInput}
          max={currentMonth}
        />
        <MonthInput
          label="Au"
          value={monthToInput}
          onChange={setMonthToInput}
          min={monthFromInput}
          max={currentMonth}
          error={rangeError && RANGE_ERROR_MESSAGE[rangeError]}
        />

        <Button
          variant="contained"
          size="small"
          disabled={Boolean(rangeError)}
          onClick={applyDateRange}
          sx={APPLY_BUTTON_SX(PALETTE_COLORS.primary)}
        >
          Appliquer
        </Button>
      </Popover>
    </>
  );
};

type MonthInputProps = {
  label: string;
  value: string;
  onChange: (month: string) => void;
  min?: string;
  max?: string;
  error?: string;
};

const MonthInput = ({
  label,
  value,
  onChange,
  min,
  max,
  error,
}: MonthInputProps) => (
  <TextField
    label={label}
    type="month"
    size="small"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    InputLabelProps={{shrink: true}}
    inputProps={{min, max}}
    error={Boolean(error)}
    helperText={error}
    fullWidth
  />
);
