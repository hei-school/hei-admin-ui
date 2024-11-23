import {
  AutocompleteArrayInput as RaAutocompleteArrayInput,
  AutocompleteArrayInputProps,
} from "react-admin";

export function AutocompleteArrayInput(props: AutocompleteArrayInputProps) {
  return (
    <RaAutocompleteArrayInput
      loadingText="Chargement..."
      noOptionsText="Aucune option"
      size="small"
      filterSelectedOptions
      fullWidth
      {...props}
    />
  );
}
