import {FilterForm, TextFilter} from "@/ui/haToolbar";

export function PromotionListFilter() {
  return (
    <FilterForm>
      <TextFilter
        source="name"
        data-testid="promotion-name-filter"
        label="Nom"
      />
      <TextFilter
        source="ref"
        data-testid="promotion-ref-filter"
        label="Référence"
      />
      <TextFilter
        source="group_ref"
        data-testid="promotion-group_ref-filter"
        label="Référence d'un group"
      />
    </FilterForm>
  );
}
