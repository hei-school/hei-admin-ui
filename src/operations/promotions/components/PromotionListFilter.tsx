import {FilterForm, TextFilter} from "@/ui/haToolbar";

export function PromotionListFilter() {
  return (
    <FilterForm>
      <TextFilter source="name" label="Nom" />
      <TextFilter source="ref" label="Référence" />
      <TextFilter source="group_ref" label="Référence d'un group" />
    </FilterForm>
  );
}
