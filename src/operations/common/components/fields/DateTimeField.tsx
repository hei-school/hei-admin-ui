import {Box, FormHelperText} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {FC} from "react";
import {FieldTitle, useInput, ValidationError, Validator} from "react-admin";

interface DatetimeFieldProps {
  source: string;
  label: string;
  validate?: Validator | Validator[];
}

export const DateTimeField: FC<DatetimeFieldProps> = ({
  source,
  label,
  validate,
}) => {
  const {field, fieldState, isRequired} = useInput({
    source,
    validate,
  });

  const {error} = fieldState;

  return (
    <Box sx={{width: "100%"}}>
      <DateTimePicker
        format="DD/MM/YYYY HH:mm"
        ampm={false}
        {...field}
        label={
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        }
        value={field.value ? dayjs(field.value) : null}
        slotProps={{
          textField: {
            size: "small",
            error: !!error?.message,
            variant: "outlined",
          },
        }}
        sx={{width: "100%"}}
      />
      <FormHelperText sx={{ml: 2}} error={!!fieldState.error}>
        <ValidationError error={error?.message || ""} />
      </FormHelperText>
    </Box>
  );
};
