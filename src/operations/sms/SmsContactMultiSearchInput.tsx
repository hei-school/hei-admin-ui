import {SmsContact} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip, TextField} from "@mui/material";
import {FieldTitle, useInput, Validator} from "react-admin";
import {SmsContactSearchResults} from "./SmsContactSearchResults";
import {MIN_SEARCH_LENGTH, useSmsContactSearch} from "./useSmsContactSearch";

const contactIdentity = (contact: SmsContact) =>
  [contact.name, contact.ownerRef].filter(Boolean).join(" — ");

interface SmsContactMultiSearchInputProps {
  source: string;
  label: string;
  validate?: Validator | Validator[];
}

export const SmsContactMultiSearchInput = ({
  source,
  label,
  validate,
}: SmsContactMultiSearchInputProps) => {
  const {field, fieldState, isRequired} = useInput({
    source,
    validate,
    defaultValue: [],
  });
  const {searchInput, setSearchInput, results, isSearching, canSearch} =
    useSmsContactSearch();

  const selectedContacts: SmsContact[] = field.value ?? [];
  const selectedIds = new Set(selectedContacts.map((contact) => contact.id));
  const availableContacts = results.filter(
    (contact) => !selectedIds.has(contact.id)
  );

  const toggleContact = (contact: SmsContact) => {
    field.onChange(
      selectedIds.has(contact.id)
        ? selectedContacts.filter((selected) => selected.id !== contact.id)
        : [...selectedContacts, contact]
    );
  };

  const getEmptyMessage = () => {
    if (!canSearch) return `Tapez au moins ${MIN_SEARCH_LENGTH} caractères`;
    if (isSearching) return "Recherche…";
    return "Aucun contact trouvé";
  };

  return (
    <Box sx={{width: "100%"}}>
      {selectedContacts.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            mb: 1.5,
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {selectedContacts.map((contact) => (
            <Chip
              key={contact.id}
              size="small"
              label={contactIdentity(contact)}
              onDelete={() => toggleContact(contact)}
            />
          ))}
        </Box>
      )}

      <TextField
        fullWidth
        size="small"
        label={
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        }
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        inputProps={{"data-testid": `sms-contact-search-${source}`}}
        sx={{mb: 1.5}}
      />

      {searchInput.length > 0 && (
        <Box
          sx={{
            mb: 1.5,
            maxHeight: 320,
            overflow: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <SmsContactSearchResults
            contacts={availableContacts}
            searchInput={searchInput}
            isSelected={(id) => selectedIds.has(id)}
            onToggle={toggleContact}
            getLabel={contactIdentity}
            emptyMessage={getEmptyMessage()}
          />
        </Box>
      )}
    </Box>
  );
};
