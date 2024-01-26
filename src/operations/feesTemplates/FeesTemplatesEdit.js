import {
  minValue,
  required,
  number,
  maxValue,
  SimpleForm,
  TextInput,
} from "react-admin";
import {EditToolBar, CustomEdit} from "../utils";

function FeesTemplatesEdit() {
  const validateAmount = [required(), number(), minValue(1)];
  const validateMonthsNumber = [
    required(),
    number(),
    minValue(1),
    maxValue(12),
  ];

  return (
    <CustomEdit>
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput
          fullWidth
          source="name"
          label="Label"
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
