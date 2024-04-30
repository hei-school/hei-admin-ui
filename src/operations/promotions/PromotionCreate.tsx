import { SimpleForm, TextInput, required } from "react-admin";
import { v4 as uuid } from "uuid"
import { CrupdatePromotion } from "@haapi/typescript-client";
import { Create } from "../common/components";

export function PromotionCreate() {
  return (
    <Create
      title=" "
      transform={(promotion: Omit<CrupdatePromotion, "id">) => ({ ...promotion, id: uuid() })}
    >
      <SimpleForm>
        <TextInput source="name" label="Nom" validate={required()} fullWidth />
        <TextInput source="ref" label="Référence" validate={required()} fullWidth />
      </SimpleForm>
    </Create>
  )
}
