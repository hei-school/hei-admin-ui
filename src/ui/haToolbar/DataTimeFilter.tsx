import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useHaToolbarContext from "./useHaToolbarContext";

type DateTimeFilterProps = {
  source: string;
  label: string;
  value?: any;
  [key: string]: any;
};

export function DateTimeFilter({
  source,
  label,
  value: overrideValue,
  ...rest
}: DateTimeFilterProps) {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const value = overrideValue ?? currentFilter[source];

  return (
    <DateTimePicker
      {...rest}
      format="MM/YYYY"
      ampm={false}
      label={label}
      value={value ? dayjs(value) : null}
      slotProps={{
        textField: {
          size: "small",
        },
      }}
      sx={{width: "100%"}}
      onChange={(value) => setOneFilter(source, value?.toISOString())}
      views={["month", "year"]}
    />
  );
}
