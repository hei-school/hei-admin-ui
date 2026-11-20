import {PALETTE_COLORS} from "@/haTheme";
import {NOOP_ID} from "@/utils/constants";
import {FeesStatistics} from "@haapi-3d601c85/typescript-client";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useMemo, useState} from "react";
import {useGetOne, useListContext} from "react-admin";
import {
  buildDayDateRange,
  DateRangeError,
  getDateRangeError,
  toDateInput,
} from "../utils/FeeListDateRange";
import {APPLY_BUTTON_SX} from "./StyleFeeStat";

const RANGE_ERROR_MESSAGE: Record<DateRangeError, string> = {
  INCOMPLETE: "",
  REVERSED: "La date de fin doit suivre la date de début.",
};

export const FeeListDateRangeFilter = () => {
  const {filterValues, setFilters} = useListContext();
  const [dateFromInput, setDateFromInput] = useState(
    toDateInput(filterValues?.listDateFrom)
  );
  const [dateToInput, setDateToInput] = useState(
    toDateInput(filterValues?.listDateTo)
  );

  const rangeError = getDateRangeError(dateFromInput, dateToInput);

  const applyDateRange = () => {
    if (rangeError) return;
    const dateRange = buildDayDateRange(dateFromInput, dateToInput);
    setFilters({...filterValues, ...dateRange}, {});
  };

  const lateFeesTotal = useLateFeesTotal(
    filterValues?.listDateFrom,
    filterValues?.listDateTo
  );

  return (
    <Box
      display="flex"
      flexDirection={{xs: "column", sm: "row"}}
      alignItems={{xs: "flex-start", sm: "center"}}
      gap={1.5}
      flexWrap="wrap"
      sx={{px: 2, pb: 2}}
    >
      <TextField
        label="Du"
        type="date"
        size="small"
        value={dateFromInput}
        onChange={(event) => setDateFromInput(event.target.value)}
        InputLabelProps={{shrink: true}}
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
      />
      <Button
        variant="contained"
        size="small"
        disabled={Boolean(rangeError)}
        onClick={applyDateRange}
        sx={APPLY_BUTTON_SX(PALETTE_COLORS.primary)}
      >
        Filtrer
      </Button>
      {lateFeesTotal !== undefined && (
        <Typography variant="body2" fontWeight={700}>
          Total frais en retard sur la période : {lateFeesTotal}
        </Typography>
      )}
    </Box>
  );
};

const useLateFeesTotal = (
  listDateFrom?: Date | string,
  listDateTo?: Date | string
): number | undefined => {
  const filters = useMemo(
    () => ({monthFrom: listDateFrom, monthTo: listDateTo}),
    [listDateFrom, listDateTo]
  );

  const {data} = useGetOne<FeesStatistics & {id: string}>(
    "stats",
    {id: NOOP_ID, meta: {resource: "fees", filters}},
    {enabled: Boolean(listDateFrom && listDateTo)}
  );

  return data?.late_fees;
};
