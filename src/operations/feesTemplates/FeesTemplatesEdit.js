import {
  minValue,
  required,
  number,
  maxValue,
  SimpleForm,
  TextInput,
  RadioButtonGroupInput,
} from "react-admin";
import {EditToolBar, CustomEdit} from "../utils";
import { v4 as uuidv4 } from "uuid";
import { FEESTEMPLATES_CHOICES } from "../fees/utils";

function FeesTemplatesEdit() {
  const validateAmount = [required(), number(), minValue(1)];
  const validateMonthsNumber = [
    required(),
    number(),
    minValue(1),
    maxValue(12),
  ];

  return (
    <CustomEdit title={'Modification de frais prédefinies'}>
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput
          fullWidth
          source="name"
          label="Label"
          validate={required()}
        />
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
          label="Montant de la mensualité"
          validate={validateAmount}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          label="Nombre de mensualités"
          validate={validateMonthsNumber}
        />
      </SimpleForm>
    </CustomEdit>
  );
}

export default FeesTemplatesEdit;
