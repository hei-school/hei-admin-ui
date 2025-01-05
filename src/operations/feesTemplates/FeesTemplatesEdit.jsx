import {
  minValue,
  required,
  number,
  SimpleForm,
  maxValue,
  TextInput,
  RadioButtonGroupInput,
} from "react-admin";

import {Edit} from "../common/components";
import {EditToolBar} from "../utils";
import {FEESTEMPLATES_CHOICES} from "../fees/constants";

function FeesTemplatesEdit() {
  return (
    <Edit
      title={"Modifier un frais prédéfini"}
      redirect={() => "fees-templates"}
      transform={(template) => {
        return {
          ...template,
          amount: +template.amount,
          number_of_payments: +template.number_of_payments,
        };
      }}
    >
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput fullWidth source="name" label="Nom" validate={required()} />
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
    </Edit>
  );
}

export default FeesTemplatesEdit;
