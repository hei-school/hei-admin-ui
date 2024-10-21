import {FilterForm, SelectInputFilter} from "@/ui/haToolbar";
import {AttendanceStatus} from "@haapi/typescript-client";

export const AttendanceFilters = () => {
  return (
    <FilterForm>
      <SelectInputFilter
        data-testid="filter-attendance-cours"
        label="Cours"
        source="courses_id"
        multiple={true}
        choices={[]}
      />
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
    </FilterForm>
  );
};
