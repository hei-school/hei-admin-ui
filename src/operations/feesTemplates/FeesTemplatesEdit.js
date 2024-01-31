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
import {FEESTEMPLATES_CHOICES} from "../fees/feesTemplatesChoices";

function FeesTemplatesEdit() {
  return (
    <CustomEdit
      title={"Modification de frais prédefinies"}
      redirect="fees-templates"
    >
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
          validate={[required(), number(), minValue(1)]}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          label="Nombre de mensualités"
          validate={[required(), number(), minValue(1), maxValue(12)]}
        />
      </SimpleForm>
    </CustomEdit>
  );
}

export default FeesTemplatesEdit;
