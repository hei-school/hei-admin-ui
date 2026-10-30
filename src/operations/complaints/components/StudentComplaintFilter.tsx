import {Box, MenuItem, Select} from "@mui/material";
import {useListFilterContext} from "react-admin";
import {
  COMPLAINT_STATUS_CHOICES,
  COMPLAINT_TYPE_CHOICES,
} from "../utils/constants";

const ALL = "";

export const StudentComplaintFilter = () => {
  const {filterValues, setFilters} = useListFilterContext();

  const updateFilter = (key: string, value: unknown) =>
    setFilters({...filterValues, [key]: value || undefined}, undefined);

  return (
    <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
      <Select
        data-testid="filter-complaint-status"
        size="small"
        displayEmpty
        value={filterValues.status ?? ALL}
        onChange={(e) => updateFilter("status", e.target.value)}
        sx={{minWidth: 170}}
      >
        <MenuItem value={ALL}>Tous les statuts</MenuItem>
        {COMPLAINT_STATUS_CHOICES.map((choice) => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        data-testid="filter-complaint-type"
        size="small"
        displayEmpty
        value={filterValues.type ?? ALL}
        onChange={(e) => updateFilter("type", e.target.value)}
        sx={{minWidth: 170}}
      >
        <MenuItem value={ALL}>Tous les types</MenuItem>
        {COMPLAINT_TYPE_CHOICES.map((choice) => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
