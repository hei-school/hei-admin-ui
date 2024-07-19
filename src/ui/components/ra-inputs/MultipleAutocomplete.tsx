import {Autocomplete, AutocompleteProps} from "./Autocomplete";

export function MultipleAutocomplete(props: AutocompleteProps) {
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
}
