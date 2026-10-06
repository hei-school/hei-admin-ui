import {Box, BoxProps, TextField, TextFieldProps} from "@mui/material";
import {useInput} from "react-admin";

export type ColorInputProps = {
  source: string;
  label: string;
  defaultValue?: string;
  wrapperProps?: BoxProps;
  inputProps?: Omit<TextFieldProps, "value" | "onChange">;
  hexInputProps?: TextFieldProps;
};

export const ColorInput = ({
  source,
  label,
  hexInputProps = {},
  inputProps = {},
  wrapperProps = {},
  defaultValue = "",
}: Readonly<ColorInputProps>) => {
  const {field} = useInput({
    source,
    defaultValue,
  });
  return (
    <Box
      sx={{display: "flex", width: "100%", alignItems: "center", gap: 2}}
      {...wrapperProps}
    >
      <TextField
        size="small"
        type="color"
        label={label}
        defaultValue="#3788d8"
        sx={{flex: 1}}
        {...inputProps}
        {...field}
      />
      <TextField
        size="small"
        placeholder="#3788d8"
        sx={{flex: 1}}
        {...hexInputProps}
        {...field}
      />
    </Box>
  );
};
