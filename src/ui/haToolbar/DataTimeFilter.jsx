import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useHaToolbarContext from "./useHaToolbarContext";

export function DateTimeFilter({source, label, ...rest}) {
  const {currentFilter, setOneFilter} = useHaToolbarContext();
  const value = currentFilter[source];

  return (
    <DateTimePicker
      ampm={false}
      label={label}
      value={value ? dayjs(value) : null}
      slotProps={{
        textField: {
          size: "small",
        },
      }}
      sx={{width: "100%"}}
      onChange={(value) => setOneFilter(source, value.toISOString())}
      views={["month"]}
    />
  );
}
