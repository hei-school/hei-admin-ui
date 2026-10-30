import {useRole} from "@/security/hooks";
import {StaffMember} from "@haapi-3d601c85/typescript-client";
import {Autocomplete, Box, MenuItem, Select, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {useDataProvider, useListFilterContext} from "react-admin";
import {COMPLAINT_STATUS_CHOICES} from "../utils/constants";

const MIN_CHARS = 2;
const ALL_STATUSES = "";

export const ComplaintFilter = () => {
  const {isAdmin, isManager} = useRole();
  const canFilterByResponsable = isAdmin() || isManager();
  const dataProvider = useDataProvider();
  const {filterValues, setFilters} = useListFilterContext();

  const [staffOptions, setStaffOptions] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staffInput, setStaffInput] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);

  const updateFilter = (key: string, value: unknown) =>
    setFilters({...filterValues, [key]: value || undefined}, undefined);

  useEffect(() => {
    if (!filterValues.assigneeId) setSelectedStaff(null);
  }, [filterValues.assigneeId]);

  useEffect(() => {
    if (staffInput.length < MIN_CHARS) {
      setStaffOptions([]);
      return;
    }
    setStaffLoading(true);
    const timeout = setTimeout(() => {
      void dataProvider
        .getList<StaffMember & {id: string}>("staffmembers", {
          pagination: {page: 1, perPage: 25},
          sort: {field: "id", order: "ASC"},
          filter: {first_name: staffInput},
        })
        .then((result) => setStaffOptions(result.data))
        .finally(() => setStaffLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [staffInput, dataProvider]);

  const getStaffOptionLabel = (option: StaffMember) =>
    `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim();

  return (
    <Box
      sx={{display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap"}}
    >
      <Select
        data-testid="filter-complaint-status"
        size="small"
        displayEmpty
        value={filterValues.complaintStatus ?? ALL_STATUSES}
        onChange={(e) => updateFilter("complaintStatus", e.target.value)}
        sx={{minWidth: 180}}
      >
        <MenuItem value={ALL_STATUSES}>Tous les statuts</MenuItem>
        {COMPLAINT_STATUS_CHOICES.map((choice) => (
          <MenuItem key={choice.id} value={choice.id}>
            {choice.name}
          </MenuItem>
        ))}
      </Select>

      {canFilterByResponsable && (
        <>
          <Autocomplete
            size="small"
            sx={{minWidth: 220}}
            options={staffOptions}
            loading={staffLoading}
            inputValue={staffInput}
            value={selectedStaff}
            onInputChange={(_, newInputValue) => setStaffInput(newInputValue)}
            onChange={(_, newValue) => {
              setSelectedStaff(newValue);
              updateFilter("assigneeId", newValue?.id);
            }}
            getOptionLabel={getStaffOptionLabel}
            isOptionEqualToValue={(option, selectedValue) =>
              option.id === selectedValue.id
            }
            noOptionsText={
              staffInput.length < MIN_CHARS
                ? `Tapez au moins ${MIN_CHARS} caractères`
                : "Aucun résultat"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Responsable"
                variant="outlined"
                data-testid="filter-complaint-responsable"
              />
            )}
          />
          <DateTimePicker
            label="De"
            format="DD/MM/YYYY"
            ampm={false}
            value={filterValues.from ? dayjs(filterValues.from) : null}
            onChange={(value) => updateFilter("from", value?.toISOString())}
            slotProps={{textField: {size: "small", sx: {minWidth: 170}}}}
          />
          <DateTimePicker
            label="À"
            format="DD/MM/YYYY"
            ampm={false}
            value={filterValues.to ? dayjs(filterValues.to) : null}
            onChange={(value) => updateFilter("to", value?.toISOString())}
            slotProps={{textField: {size: "small", sx: {minWidth: 170}}}}
          />
        </>
      )}
    </Box>
  );
};
