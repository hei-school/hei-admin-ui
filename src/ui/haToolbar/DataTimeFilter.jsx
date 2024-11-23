import {TextField} from "@mui/material";
import useHaToolbarContext from "./useHaToolbarContext";
import {DateTimePicker} from "@mui/x-date-pickers";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {renderTimeViewClock} from "@mui/x-date-pickers/timeViewRenderers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {useEffect} from "react";

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
    />
  );
}
