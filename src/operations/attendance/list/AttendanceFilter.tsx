import {DateTimeFilter, FilterForm, SelectInputFilter} from "@/ui/haToolbar";
import {AttendanceStatus} from "@haapi/typescript-client";
import {Typography} from "@mui/material";

export const AttendanceFilters = () => {
  return (
    <FilterForm>
      <SelectInputFilter
        data-testid="filter-attendance-status"
        label="Status"
        source="attendance_statuses"
        multiple={true}
        choices={[
          {id: AttendanceStatus.PRESENT, name: "Présent"},
          {id: AttendanceStatus.LATE, name: "En retard"},
          {id: AttendanceStatus.MISSING, name: "Absent"},
        ]}
      />
      <Typography
        variant="body2"
        fontWeight="bold"
        color="#B4B5B7"
        sx={{mt: 2, mb: 1}}
      >
        Filtre par plage de date
      </Typography>
      <DateTimeFilter source="from" label="De" />
      <DateTimeFilter source="to" label="À" />
    </FilterForm>
  );
};
