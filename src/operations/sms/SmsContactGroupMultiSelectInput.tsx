import {SmsContactGroup} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import {FieldTitle, useGetList, useInput, Validator} from "react-admin";
import {SmsCheckboxSearchList} from "./SmsCheckboxSearchList";

export const MIN_GROUP_FILTER_LENGTH = 2;

interface SmsContactGroupMultiSelectInputProps {
  source: string;
  label: string;
  validate?: Validator | Validator[];
}

export const SmsContactGroupMultiSelectInput = ({
  source,
  label,
  validate,
}: SmsContactGroupMultiSelectInputProps) => {
  const {field, fieldState, isRequired} = useInput({
    source,
    validate,
    defaultValue: [],
  });
  const [filter, setFilter] = useState("");
  const {data: contactGroups = [], isLoading} = useGetList(
    "sms-contact-groups",
    {pagination: {page: 1, perPage: 500}}
  );

  const selectedGroups: SmsContactGroup[] = field.value ?? [];
  const selectedIds = new Set(selectedGroups.map((group) => group.id));
  const canSearch = filter.trim().length >= MIN_GROUP_FILTER_LENGTH;

  const filteredGroups = useMemo(() => {
    if (!canSearch) return [];
    const groups = contactGroups as SmsContactGroup[];
    const normalizedFilter = filter.trim().toLowerCase();
    return groups.filter((group) =>
      group.name?.toLowerCase().includes(normalizedFilter)
    );
  }, [contactGroups, filter, canSearch]);

  const toggleGroup = (group: SmsContactGroup) => {
    field.onChange(
      selectedIds.has(group.id)
        ? selectedGroups.filter((selected) => selected.id !== group.id)
        : [...selectedGroups, group]
    );
  };

  return (
    <Box sx={{width: "100%"}}>
      {selectedGroups.length > 0 && (
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
          {selectedGroups.map((group) => (
            <Chip
              key={group.id}
              size="small"
              label={group.name}
              onDelete={() => toggleGroup(group)}
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
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        inputProps={{"data-testid": "sms-contact-group-filter-input"}}
        sx={{mb: 1.5}}
      />

      {filter.length > 0 && (
        <SmsCheckboxSearchList
          items={filteredGroups}
          getId={(group) => group.id}
          getLabel={(group) => group.name ?? "—"}
          isSelected={(id) => selectedIds.has(id)}
          onToggle={toggleGroup}
          testIdPrefix="toggle-sms-contact-group"
          emptyMessage={
            !canSearch
              ? `Tapez au moins ${MIN_GROUP_FILTER_LENGTH} caractères`
              : isLoading
                ? "Chargement…"
                : "Aucun groupe trouvé"
          }
        />
      )}
    </Box>
  );
};
