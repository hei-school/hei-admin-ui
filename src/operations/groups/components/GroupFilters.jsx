import {
  FilterForm,
  SelectInputFilter,
  TextFilter,
  DateTimeFilter,
} from "@/ui/haToolbar";

export function GroupFilters() {
  return (
    <FilterForm>
      <TextFilter
        data-testid="filter-group-student-ref"
        label="Référence d'un étudiant"
        source="student_ref"
      />
      <TextFilter
        data-testid="filter-group-ref"
        label="Référence d'un groupe"
        source="ref"
      />
    </FilterForm>
  );
}
