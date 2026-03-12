import {CrupdatePromotion} from "@haapi-b0fc7615/typescript-client";
import {SelectInput, SimpleForm, TextInput, required} from "react-admin";
import {v4 as uuid} from "uuid";
import {Create} from "../common/components";
import {CYCLE_LEVEL_CHOICES} from "./utils/constant";

export function PromotionCreate() {
  return (
    <Create
      title=" "
      transform={(promotion: CrupdatePromotion) => ({
        ...promotion,
        id: uuid(),
      })}
    >
      <SimpleForm>
        <TextInput source="name" label="Nom" validate={required()} fullWidth />
        <TextInput
          source="ref"
          label="Référence"
          validate={required()}
          fullWidth
        />
        <SelectInput
          source="cycle_level"
          label="Niveau du cycle"
          choices={CYCLE_LEVEL_CHOICES}
          optionValue="id"
          optionText="name"
          fullWidth
          required
          emptyText="--Niveau du cycle--"
        />
      </SimpleForm>
    </Create>
  );
}
