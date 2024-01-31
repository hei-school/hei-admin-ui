import {
  maxValue,
  minValue,
  required,
  number,
  Create,
  SimpleForm,
  TextInput,
  RadioButtonGroupInput,
} from "react-admin";
import {v4 as uuid} from "uuid";

import {FEESTEMPLATES_CHOICES} from "../fees/feesTemplatesChoices";

function FeesTemplatesCreate() {
  return (
    <Create
      title={"Créer une frais prédéfinie"}
      redirect={() => "fees-templates"}
      transform={(feesTemplates) => ({...feesTemplates, id: uuid()})}
    >
      <SimpleForm>
        <TextInput
          label="Label"
          source="name"
          fullWidth
          validate={[required()]}
        />
        <RadioButtonGroupInput
          source="type"
          name="type"
          data-testid="type"
          label="Type manuel"
          optionText="label"
          optionValue="value"
          choices={FEESTEMPLATES_CHOICES}
          validate={required()}
        />
        <TextInput
          fullWidth
          source="amount"
          name="amount"
          data-testid="amount"
          label="Montant de la mensualité"
          validate={[required(), number(), minValue(1)]}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          name="number_of_payments"
          data-testid="number_of_payments"
          label="Nombre de mensualités"
          validate={[required(), number(), minValue(1), maxValue(12)]}
        />
      </SimpleForm>
    </Create>
  );
}

export default FeesTemplatesCreate;
