import {FilterForm, TextFilter} from "@/ui/haToolbar";

export function GroupStudentsFilters() {
  return (
    <FilterForm>
      <TextFilter label="Prénom.s d'un étudiant" source="first_name" />
    </FilterForm>
  );
}
