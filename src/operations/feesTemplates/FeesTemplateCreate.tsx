import {Box} from "@mui/material";
import {
  Create,
  maxValue,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import {v4 as uuid} from "uuid";

import {FeeCategory, FeeFrequency} from "@haapi/typescript-client";
import {
  CATEGORY_CHOICES,
  FEES_FREQUENCY_CHOICES,
  FEESTEMPLATES_CHOICES,
} from "../fees/constants";

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
          choices={[...FEESTEMPLATES_CHOICES]}
          validate={required()}
        />
        <Box display="grid" width="100%" gridTemplateColumns="1fr 1fr" gap={2}>
          <SelectInput
            source="category"
            name="category"
            id="category"
            defaultValue={FeeCategory.UNKNOWN}
            label="Catégorie du frais"
            choices={[...CATEGORY_CHOICES]}
            validate={required()}
          />
          <SelectInput
            source="frequency"
            name="frequency"
            id="frequency"
            defaultValue={FeeFrequency.UNKNOWN}
            label="Frequence du frais"
            choices={[...FEES_FREQUENCY_CHOICES]}
            validate={required()}
          />
        </Box>
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
