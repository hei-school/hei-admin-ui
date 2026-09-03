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
import {buildDateRange, toMonthInput} from "./FeeDateRange";

export const DateRangePopover = () => {
  const {filterValues, setFilters} = useListContext();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [monthFromInput, setMonthFromInput] = useState("");
  const [monthToInput, setMonthToInput] = useState("");

  const openPopover = (event: MouseEvent<HTMLElement>) => {
    setMonthFromInput(toMonthInput(filterValues?.monthFrom));
    setMonthToInput(toMonthInput(filterValues?.monthTo));
    setAnchor(event.currentTarget);
  };

  const closePopover = () => setAnchor(null);

  const applyDateRange = () => {
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
        />
        <MonthInput
          label="Au"
          value={monthToInput}
          onChange={setMonthToInput}
        />

        <Button
          variant="contained"
          size="small"
          disabled={!monthFromInput || !monthToInput}
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
};

const MonthInput = ({label, value, onChange}: MonthInputProps) => (
  <TextField
    label={label}
    type="month"
    size="small"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    InputLabelProps={{shrink: true}}
    fullWidth
  />
);
