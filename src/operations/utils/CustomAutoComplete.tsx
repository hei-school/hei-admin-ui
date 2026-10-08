import {Autocomplete, AutocompleteProps, TextField} from "@mui/material";
import {useState} from "react";
import {Identifier} from "react-admin";
import {Control, Controller, FieldPath, FieldValues} from "react-hook-form";

export interface AutoCompleteOption {
  id?: Identifier;
  ref?: string;
}

type ControlledAutocompleteProps = Omit<
  AutocompleteProps<AutoCompleteOption, false, false, false>,
  | "options"
  | "noOptionsText"
  | "getOptionLabel"
  | "isOptionEqualToValue"
  | "onChange"
  | "value"
  | "inputValue"
  | "onInputChange"
  | "renderInput"
>;

interface CustomAutoCompleteProps<TFieldValues extends FieldValues>
  extends ControlledAutocompleteProps {
  data: AutoCompleteOption[];
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  onInputChange: (inputValue: string) => void;
}

export const CustomAutoComplete = <TFieldValues extends FieldValues>({
  data,
  control,
  name,
  label,
  onInputChange,
  ...props
}: Readonly<CustomAutoCompleteProps<TFieldValues>>) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <Autocomplete
          {...props}
          options={data}
          noOptionsText="Aucune option"
          getOptionLabel={(option) => String(option.ref)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, newValue) => onChange(newValue)}
          value={value}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
            onInputChange(newInputValue);
          }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      )}
    />
  );
};
