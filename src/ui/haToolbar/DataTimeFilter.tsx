import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useHaToolbarContext from "./useHaToolbarContext";

import type {DateOrTimeView} from "@mui/x-date-pickers/models";

type DateTimeFilterProps = {
  source: string;
  format?: string;
  label: string;
  value?: any;
  [key: string]: any;
  view?: Array<DateOrTimeView>;
};

export function DateTimeFilter({
  source,
  label,
  value: overrideValue,
  format,
  view,
  ...rest
}: DateTimeFilterProps) {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const value = overrideValue ?? currentFilter[source];

  return (
    <DateTimePicker
      {...rest}
      format={format ?? "DD/MM/YYYY"}
      ampm={false}
      label={label}
      sx={{width: "100%"}}
      value={value ? dayjs(value) : null}
      slotProps={{
        textField: {
          size: "small",
        },
      }}
      views={view ?? ["day", "month", "year"]}
      onChange={(value) => setOneFilter(source, value?.toISOString())}
    />
  );
}
