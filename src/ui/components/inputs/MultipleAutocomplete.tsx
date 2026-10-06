import {FieldValues} from "react-hook-form";
import {Autocomplete, AutocompleteProps} from "./Autocomplete";

export const MultipleAutocomplete = <TForm extends FieldValues>(
  props: AutocompleteProps<TForm>
) => {
  return (
    <Autocomplete
      multiple
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      {...props}
    />
  );
};
