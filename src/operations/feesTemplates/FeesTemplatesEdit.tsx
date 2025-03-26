import {Box} from "@mui/material";
import {
  maxValue,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useEditController,
} from "react-admin";

import {FeeCategory, FeeFrequency} from "@haapi/typescript-client";
import {Edit} from "../common/components";
import {
  CATEGORY_CHOICES,
  FEES_FREQUENCY_CHOICES,
  FEESTEMPLATES_CHOICES,
} from "../fees/constants";
import {EditToolBar} from "../utils";

function FeesTemplatesEdit() {
  const {record} = useEditController();

  return (
    <Edit
      title={"Modifier un frais prédéfini"}
      redirect={() => "fees-templates"}
      transform={(template: any) => {
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
          choices={[...FEESTEMPLATES_CHOICES]}
          validate={required()}
        />
        <Box display="grid" width="100%" gridTemplateColumns="1fr 1fr" gap={2}>
          <SelectInput
            source="category"
            name="category"
            id="category"
            defaultValue={record?.category || FeeCategory.UNKNOWN}
            label="Catégorie du frais"
            choices={[...CATEGORY_CHOICES]}
            validate={required()}
          />
          <SelectInput
            source="frequency"
            name="frequency"
            id="frequency"
            defaultValue={record?.frequency || FeeFrequency.UNKNOWN}
            label="Frequence du frais"
            choices={[...FEES_FREQUENCY_CHOICES]}
            validate={required()}
          />
        </Box>
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
