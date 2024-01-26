import { maxValue, minValue, required, number, Create, SimpleForm, TextInput, RadioButtonGroupInput } from "react-admin";
import { FEESTEMPLATES_CHOICES } from "../fees/utils";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

function FeesTemplatesCreate() {
  const validateAmount = [required(), number(), minValue(1)];
  const validateMonthsNumber = [
    required(),
    number(),
    minValue(1),
    maxValue(12),
  ];
  const id = useMemo(()=>uuidv4(), [])

  return (
    <Create 
      title={'Créer une frais prédéfinie'} 
      redirect={() => `feesTemplates`}
      transform={feesTemplates => ({ ...feesTemplates, id})}
    >
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
