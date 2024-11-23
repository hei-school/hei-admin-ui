import {
  AutocompleteInputProps,
  AutocompleteInput as RaAutocompleteInput,
} from "react-admin";

export function AutocompleteInput(props: AutocompleteInputProps) {
  return (
    <RaAutocompleteInput
      loadingText="Chargement..."
      noOptionsText="Aucune option"
      size="small"
      filterSelectedOptions
      fullWidth
      {...props}
    />
  );
}
