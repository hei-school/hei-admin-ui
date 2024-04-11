import {FilterForm, SelectInputFilter} from "../../../ui/haToolbar";
import {FeeStatusEnum} from "@haapi/typescript-client";

export const FeesFilter = () => (
  <FilterForm>
    <SelectInputFilter
      data-testid="filter-fees-status"
      label="Statut"
      source="status"
      choices={[
        {id: FeeStatusEnum.LATE, name: "En retard"},
        {id: FeeStatusEnum.PAID, name: "Payés"},
        {id: FeeStatusEnum.UNPAID, name: "En attente"},
      ]}
    />
  </FilterForm>
);
