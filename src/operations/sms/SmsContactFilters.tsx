import {
  SmsContactGroup,
  SmsContactOwnerRole,
} from "@haapi-b0fc7615/typescript-client";
import {MenuItem, Stack, TextField} from "@mui/material";
import {useGetList, useListContext} from "react-admin";
import {SMS_OWNER_ROLE_LABEL} from "./constants";

export const SmsContactFilters = () => {
  const {filterValues, setFilters} = useListContext();
  const {data: contactGroups = []} = useGetList("sms-contact-groups", {
    pagination: {page: 1, perPage: 500},
  });

  const updateFilter = (key: string, value: string) => {
    const nextFilters = {...filterValues, [key]: value || undefined};
    if (!value) {
      delete nextFilters[key];
    }
    setFilters(nextFilters, {});
  };

  return (
    <Stack direction="row" spacing={1.5}>
      <TextField
        select
        size="small"
        label="Rôle"
        value={filterValues.ownerRole ?? ""}
        onChange={(event) => updateFilter("ownerRole", event.target.value)}
        sx={{minWidth: 160}}
      >
        <MenuItem value="">Tous</MenuItem>
        {Object.values(SmsContactOwnerRole).map((role) => (
          <MenuItem key={role} value={role}>
            {SMS_OWNER_ROLE_LABEL[role]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="Groupe"
        value={filterValues.contactGroupId ?? ""}
        onChange={(event) => updateFilter("contactGroupId", event.target.value)}
        sx={{minWidth: 200}}
      >
        <MenuItem value="">Tous</MenuItem>
        {(contactGroups as SmsContactGroup[]).map((group) => (
          <MenuItem key={group.id} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};
