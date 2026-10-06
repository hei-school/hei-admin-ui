import {
  Chip,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";

export type AutocompleteOption = {
  id: string;
  label: string;
};

export type AutocompleteProps<TForm extends FieldValues = FieldValues> = {
  name: Path<TForm>;
  control: Control<TForm>;
  options: AutocompleteOption[];
  inputLabel: string;
  controllerProps?: Partial<ControllerProps<TForm>>;
  inputProps?: Partial<TextFieldProps>;
} & Partial<
  MuiAutocompleteProps<
    AutocompleteOption,
    true,
    undefined,
    undefined,
    typeof Chip
  >
>;

export const Autocomplete = <TForm extends FieldValues>({
  getOptionKey,
  getOptionLabel,
  name,
  control,
  options,
  inputLabel,
  controllerProps,
  inputProps,
  ...autcompleteProps
}: AutocompleteProps<TForm>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}}) => (
        <MuiAutocomplete
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
          renderInput={(params) => (
            <TextField
              {...params}
              label={inputLabel}
              size="small"
              sx={{mb: 2}}
              variant="outlined"
              {...inputProps}
            />
          )}
          {...autcompleteProps}
        />
      )}
      {...controllerProps}
    />
  );
};
