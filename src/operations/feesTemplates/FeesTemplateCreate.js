import { maxValue, minValue, required, number, Create, SimpleForm, TextInput, RadioButtonGroupInput } from "react-admin";
import { FEESTEMPLATES_CHOICES } from "../fees/utils";

function FeesTemplatesCreate() {
  const validateAmount = [required(), number(), minValue(1)];
  const validateMonthsNumber = [
    required(),
    number(),
    minValue(1),
    maxValue(12),
  ];

  return (
    <Create title={'Créer une frais prédéfinie'}>
      <SimpleForm>
        <TextInput label="Label" source="name" fullWidth validate={[required()]} />
        <RadioButtonGroupInput
          source="type"
          name="type"
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
          label="Montant de la mensualité"
          validate={validateAmount}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          name="number_of_payments"
          label="Nombre de mensualités"
          validate={validateMonthsNumber}
        />
      </SimpleForm>
    </Create>
  )
}

export default FeesTemplatesCreate;
