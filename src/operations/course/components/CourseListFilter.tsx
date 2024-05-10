import {FilterForm, TextFilter} from "@/ui/haToolbar";

export function CourseListFilter() {
  return (
    <FilterForm>
      <TextFilter data-testid="course-filter-code" source="code" label="Code" />
      <TextFilter data-testid="course-filter-name" source="name" label="Nom" />
    </FilterForm>
  );
}
