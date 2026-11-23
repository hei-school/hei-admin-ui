import {PALETTE_COLORS} from "@/haTheme";
import {FeeStatusEnum} from "@haapi-3d601c85/typescript-client";
import {FilterList} from "@mui/icons-material";
import {Button, MenuItem, Popover, TextField, Typography} from "@mui/material";
import {MouseEvent, useState} from "react";
import {useListContext} from "react-admin";
import {
  buildDayDateRange,
  DateRangeError,
  getDateRangeError,
  toDateInput,
} from "../utils/FeeListDateRange";
import {APPLY_BUTTON_SX, DATE_POPOVER_PAPER_SX} from "./StyleFeeStat";

const RANGE_ERROR_MESSAGE: Record<DateRangeError, string> = {
  INCOMPLETE: "",
  REVERSED: "La date de fin doit suivre la date de début.",
};

const STATUS_OPTIONS = [
  {label: "En retard", value: FeeStatusEnum.LATE},
  {label: "En cours", value: FeeStatusEnum.PENDING},
  {label: "Payés", value: FeeStatusEnum.PAID},
  {label: "Non payés", value: FeeStatusEnum.UNPAID},
];

export const FeeListFilterButton = () => {
  const {filterValues, setFilters} = useListContext();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [statusInput, setStatusInput] = useState<FeeStatusEnum>(
    FeeStatusEnum.LATE
  );

  const rangeError = getDateRangeError(dateFromInput, dateToInput);

  const openPopover = (event: MouseEvent<HTMLElement>) => {
    setDateFromInput(toDateInput(filterValues?.listDateFrom));
    setDateToInput(toDateInput(filterValues?.listDateTo));
    setStatusInput(filterValues?.status ?? FeeStatusEnum.LATE);
    setAnchor(event.currentTarget);
  };

  const closePopover = () => setAnchor(null);

  const applyFilters = () => {
    if (rangeError) return;
    const dateRange = buildDayDateRange(dateFromInput, dateToInput);
    setFilters({...filterValues, ...dateRange, status: statusInput}, {});
    closePopover();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FilterList fontSize="small" />}
        onClick={openPopover}
        sx={{textTransform: "none"}}
      >
        Filtre
      </Button>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closePopover}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        transformOrigin={{vertical: "top", horizontal: "left"}}
        slotProps={{paper: {sx: DATE_POPOVER_PAPER_SX}}}
      >
        <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary">
          Filtrer la liste
        </Typography>

        <TextField
          label="Du"
          type="date"
          size="small"
          value={dateFromInput}
          onChange={(event) => setDateFromInput(event.target.value)}
          InputLabelProps={{shrink: true}}
          fullWidth
          sx={{mt: 1.5, mb: 1.5}}
        />
        <TextField
          label="Au"
          type="date"
          size="small"
          value={dateToInput}
          onChange={(event) => setDateToInput(event.target.value)}
          InputLabelProps={{shrink: true}}
          error={Boolean(rangeError && RANGE_ERROR_MESSAGE[rangeError])}
          helperText={rangeError && RANGE_ERROR_MESSAGE[rangeError]}
          fullWidth
          sx={{mb: 1.5}}
        />
        <TextField
          select
          label="Statut"
          size="small"
          value={statusInput}
          onChange={(event) =>
            setStatusInput(event.target.value as FeeStatusEnum)
          }
          fullWidth
          sx={{mb: 1.5}}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          size="small"
          disabled={Boolean(rangeError)}
          onClick={applyFilters}
          sx={APPLY_BUTTON_SX(PALETTE_COLORS.primary)}
        >
          Appliquer
        </Button>
      </Popover>
    </>
  );
};
