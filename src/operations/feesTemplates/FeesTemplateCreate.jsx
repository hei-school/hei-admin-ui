import {
  Create,
  maxValue,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
import {v4 as uuid} from "uuid";

import {FEESTEMPLATES_CHOICES} from "../fees/constants";

function FeesTemplatesCreate() {
  return (
    <Create
      title={"Créer un frais prédéfini"}
      redirect={() => "fees-templates"}
      transform={(feesTemplate) => {
        return {
          ...feesTemplate,
          id: uuid(),
          amount: +feesTemplate.amount,
          number_of_payments: +feesTemplate.number_of_payments,
        };
      }}
    >
      <SimpleForm>
        <TextInput
          label="Nom"
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
