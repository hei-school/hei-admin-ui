import { Controller, ControllerProps, Control } from "react-hook-form";
import { Autocomplete as MuiAutocomplete, AutocompleteProps, Chip, TextField, TextFieldProps } from "@mui/material"

export type MultipleAutocompleteOption = {
  id: string, label: string
};

export type MultipleAutocompleteProps = {
  name: string;
  control: Control<any>;
  options: MultipleAutocompleteOption[];
  inputLabel: string;
  controllerProps?: Partial<ControllerProps>;
  inputProps?: Partial<TextFieldProps>;
} & Partial<AutocompleteProps<MultipleAutocompleteOption, true, undefined, undefined, typeof Chip>>;

export function MultipleAutocomplete({ getOptionKey, getOptionLabel, name, control, options, inputLabel, controllerProps, inputProps, ...autcompleteProps }: MultipleAutocompleteProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <MuiAutocomplete
          multiple
          fullWidth
          value={value}
          options={options}
          onChange={(_event, newValue) => onChange(newValue)}
          loadingText="Chargement..."
          noOptionsText="Aucune option"
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(optionLhs, optionRhs) =>
            optionLhs.id === optionRhs.id
          }
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label={inputLabel} size="small" sx={{ mb: 2 }} variant="outlined" {...inputProps} />
          )}
          sx={{ "& select": { zIndex: 99999, bgcolor: "red" } }}
          {...autcompleteProps}
        />
      )}
      {...controllerProps}
    />
  )
}
