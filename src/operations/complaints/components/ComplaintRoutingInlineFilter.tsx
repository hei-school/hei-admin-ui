import {Manager} from "@haapi-3d601c85/typescript-client";
import {Autocomplete, Box, MenuItem, Select, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider, useListFilterContext} from "react-admin";
import {COMPLAINT_TYPE_CHOICES} from "../utils/constants";

const ALL_TYPES = "";

export const ComplaintRoutingInlineFilter = () => {
  const dataProvider = useDataProvider();
  const {filterValues, setFilters} = useListFilterContext();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  useEffect(() => {
    void dataProvider
      .getList<Manager & {id: string}>("managers", {
        pagination: {page: 1, perPage: 100},
        sort: {field: "id", order: "ASC"},
        filter: {},
      })
      .then((result) => setManagers(result.data));
  }, [dataProvider]);

  useEffect(() => {
    if (!filterValues.managerId) setSelectedManager(null);
  }, [filterValues.managerId]);

  const getOptionLabel = (option: Manager) =>
    `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim();

  return (
    <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
      <Select
        data-testid="filter-routing-type"
        size="small"
        displayEmpty
        value={filterValues.complaintType ?? ALL_TYPES}
        onChange={(e) =>
          setFilters(
            {
              ...filterValues,
              complaintType: e.target.value || undefined,
            },
            undefined
          )
        }
        sx={{minWidth: 180}}
      >
        <MenuItem value={ALL_TYPES}>Tous les types</MenuItem>
        {COMPLAINT_TYPE_CHOICES.map((choice) => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>
      <Autocomplete
        size="small"
        sx={{minWidth: 220}}
        options={managers}
        value={selectedManager}
        onChange={(_, newValue) => {
          setSelectedManager(newValue);
          setFilters(
            {...filterValues, managerId: newValue?.id || undefined},
            undefined
          );
        }}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, selectedValue) =>
          option.id === selectedValue.id
        }
        noOptionsText="Aucun manager trouvé"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Manager"
            variant="outlined"
            data-testid="filter-routing-manager"
          />
        )}
      />
    </Box>
  );
};
