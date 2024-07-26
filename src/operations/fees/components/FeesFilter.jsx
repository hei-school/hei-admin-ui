import {FilterForm, TextFilter} from "@/ui/haToolbar";
import {FeeStatusEnum} from "@haapi/typescript-client";

export const FeesFilter = () => (
  <FilterForm>
    <TextFilter label="Référence étudiante" source="student_ref" />
  </FilterForm>
);
