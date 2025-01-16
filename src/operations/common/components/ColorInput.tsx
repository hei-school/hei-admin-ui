import {ChangeEvent, FC} from "react";
import {BoxProps, TextFieldProps, Box, TextField} from "@mui/material";
import {useWatch, useFormContext} from "react-hook-form";

export type ColorInputProps = {
  source: string;
  label: string;
  wrapperProps?: BoxProps;
  inputProps?: TextFieldProps;
  hexInputProps?: TextFieldProps;
};

export const ColorInput: FC<ColorInputProps> = ({
  source,
  label,
  hexInputProps = {},
  inputProps = {},
  wrapperProps = {},
}) => {
  const value = useWatch({name: source});
  const {setValue} = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event?.target?.value;
    setValue(source, inputValue);
  };

  return (
    <Box
      sx={{display: "flex", width: "100%", alignItems: "center", gap: 2}}
      {...wrapperProps}
    >
      <TextField
        size="small"
        type="color"
        label={label}
        value={value}
        defaultValue="#3788d8"
        onChange={handleChange}
        sx={{flex: 1}}
        {...inputProps}
      />
      <TextField
        size="small"
        value={value}
        placeholder="#3788d8"
        onChange={handleChange}
        sx={{flex: 1}}
        {...hexInputProps}
      />
    </Box>
  );
};
