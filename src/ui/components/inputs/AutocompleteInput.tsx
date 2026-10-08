import {
  AutocompleteInputProps,
  AutocompleteInput as RaAutocompleteInput,
} from "react-admin";

export const AutocompleteInput = (props: Readonly<AutocompleteInputProps>) => {
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
};
